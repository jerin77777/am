import argparse
import getpass
import os
import sys
import time
from PIL import Image

MODEL_ID = "briaai/RMBG-2.0"


def huggingface_login(token=None):
    """
    Authenticate with Hugging Face so gated models (RMBG-2.0) can be downloaded.
    Token order: --hf-token / function arg, then HF_TOKEN / HUGGING_FACE_HUB_TOKEN env,
    then existing cached login, then interactive prompt.
    """
    try:
        from huggingface_hub import HfApi, login, whoami
    except ImportError:
        print("\n[Error] huggingface_hub is not installed.")
        print("Install it with:  pip install huggingface_hub\n")
        return False

    if not token:
        token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN")

    def _already_logged_in():
        try:
            info = whoami()
            name = info.get("name") or info.get("email") or "authenticated user"
            print(f"Hugging Face session: logged in as {name}")
            return True
        except Exception:
            return False

    if not token and _already_logged_in():
        return True

    if not token:
        print("\nRMBG-2.0 is a gated Hugging Face model.")
        print("1. Request access: https://huggingface.co/briaai/RMBG-2.0")
        print("2. Create a token (read access): https://huggingface.co/settings/tokens")
        print("You can also set HF_TOKEN in the environment to skip this prompt.\n")
        try:
            token = getpass.getpass("Enter Hugging Face token (input hidden): ").strip()
        except Exception:
            token = input("Enter Hugging Face token: ").strip()

    if not token:
        print("Error: No Hugging Face token provided.", file=sys.stderr)
        return False

    try:
        login(token=token, add_to_git_credential=False)
        info = HfApi().whoami(token=token)
        name = info.get("name") or info.get("email") or "authenticated user"
        print(f"Hugging Face login successful ({name})")
        return True
    except Exception as e:
        print(f"Error logging in to Hugging Face: {e}", file=sys.stderr)
        return False


def process_folder(input_folder, output_folder=None, device_choice=None, hf_token=None):
    """
    Removes background from all images in input_folder using Hugging Face briaai/RMBG-2.0
    and saves transparent PNGs to output_folder ('rembg' by default).
    """
    try:
        import torch
        from torchvision import transforms
        from transformers import AutoModelForImageSegmentation
    except ImportError:
        print("\n[Error] Required libraries not installed.")
        print("Please install requirements using:")
        print("  pip install torch torchvision transformers pillow kornia einops huggingface_hub\n")
        return False

    if not os.path.exists(input_folder):
        print(f"Error: Input folder '{input_folder}' does not exist.", file=sys.stderr)
        return False

    if output_folder is None:
        output_folder = os.path.join(input_folder, "rembg")

    os.makedirs(output_folder, exist_ok=True)

    # Determine computing device (CUDA GPU if available, else CPU)
    if device_choice:
        device = device_choice
    else:
        device = "cuda" if torch.cuda.is_available() else "cpu"

    print("=" * 65)
    print(" RMBG-2.0 Background Removal")
    print(f"  Input Folder  : {os.path.abspath(input_folder)}")
    print(f"  Output Folder : {os.path.abspath(output_folder)}")
    print(f"  Model         : {MODEL_ID} (Hugging Face)")
    print(f"  Device        : {device.upper()}")
    print("=" * 65)

    if not huggingface_login(hf_token):
        print(
            "Cannot load a gated model without Hugging Face authentication.",
            file=sys.stderr,
        )
        return False

    print(f"\nLoading model '{MODEL_ID}'... Please wait...")
    try:
        model = AutoModelForImageSegmentation.from_pretrained(
            MODEL_ID,
            trust_remote_code=True
        )
        if hasattr(torch, "set_float32_matmul_precision"):
            torch.set_float32_matmul_precision("high")
        model.to(device)
        model.eval()
    except Exception as e:
        print(f"Error loading model '{MODEL_ID}': {e}", file=sys.stderr)
        print(
            "If this is a 401/gated-repo error, accept the model terms at "
            f"https://huggingface.co/{MODEL_ID} using the same Hugging Face account.",
            file=sys.stderr,
        )
        return False

    # RMBG-2.0 image preprocessing transform
    transform_image = transforms.Compose([
        transforms.Resize((1024, 1024)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    # Find all supported image files in input directory
    valid_exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    image_files = [
        f for f in sorted(os.listdir(input_folder))
        if os.path.splitext(f)[1].lower() in valid_exts and not f.startswith(".")
    ]

    if not image_files:
        print(f"No valid image files found in '{input_folder}'.")
        return False

    total_images = len(image_files)
    print(f"Found {total_images} image(s) to process.\n")

    start_total_time = time.time()

    for idx, filename in enumerate(image_files, 1):
        in_path = os.path.join(input_folder, filename)
        base_name = os.path.splitext(filename)[0]
        out_filename = f"{base_name}.png"
        out_path = os.path.join(output_folder, out_filename)

        print(f"[{idx}/{total_images}] Processing '{filename}'...", end="", flush=True)
        img_start = time.time()

        try:
            image = Image.open(in_path).convert("RGB")
            orig_size = image.size

            input_tensor = transform_image(image).unsqueeze(0).to(device)

            with torch.no_grad():
                preds = model(input_tensor)[-1].sigmoid().cpu()

            pred = preds[0].squeeze()
            mask_pil = transforms.ToPILImage()(pred)
            mask_resized = mask_pil.resize(orig_size, Image.BILINEAR)

            # Apply background mask to original image alpha channel
            result_img = image.copy()
            result_img.putalpha(mask_resized)

            result_img.save(out_path, "PNG")
            elapsed = time.time() - img_start
            print(f" Done ({elapsed:.2f}s) -> saved to '{out_filename}'")

        except Exception as e:
            print(f" FAILED ({e})")

    total_elapsed = time.time() - start_total_time
    print("\n" + "=" * 65)
    print(f"Successfully processed {total_images} images in {total_elapsed:.2f}s!")
    print(f"Results saved to: {os.path.abspath(output_folder)}")
    print("=" * 65)
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Remove image background using Hugging Face briaai/RMBG-2.0 AI model."
    )
    parser.add_argument(
        "folder",
        nargs="?",
        default=None,
        help="Path to input folder containing images (e.g., public/wheel_frames)"
    )
    parser.add_argument(
        "-o", "--output",
        default=None,
        help="Path to output folder (default: <input_folder>/rembg)"
    )
    parser.add_argument(
        "-d", "--device",
        choices=["cuda", "cpu"],
        default=None,
        help="Device to use for inference ('cuda' or 'cpu')"
    )
    parser.add_argument(
        "--hf-token",
        default=None,
        help="Hugging Face access token (or set HF_TOKEN / HUGGING_FACE_HUB_TOKEN)"
    )

    args = parser.parse_args()

    input_path = args.folder
    if not input_path:
        input_path = input("Enter the folder path containing images to process: ").strip().strip('"\'')

    if input_path:
        process_folder(input_path, args.output, args.device, args.hf_token)
    else:
        print("Error: No folder path specified.")
