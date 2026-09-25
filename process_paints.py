import os
import cv2
import numpy as np

def clean_and_enhance_paint(input_path, output_path):
    """
    Cleans up decal/paint graphics:
    - Removes white and off-white background pixels (making them transparent).
    - Fills small gaps/pinholes inside solid shapes using morphological operations.
    - Smooths curve edges and straight lines while keeping contours sharp.
    - Enhances color saturation and sharpens internal decal graphics.
    """
    if not os.path.exists(input_path):
        print(f"Error: Input file '{input_path}' not found.")
        return False

    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print(f"Error: Failed to read image '{input_path}'.")
        return False

    # Extract RGBA channels
    if img.shape[2] == 3:
        b, g, r = cv2.split(img)
        a = np.ones_like(b) * 255
    else:
        b, g, r, a = cv2.split(img)

    # 1. White and background pixel removal
    # Brightness / Luminance calculation
    brightness = 0.299 * r.astype(np.float32) + 0.587 * g.astype(np.float32) + 0.114 * b.astype(np.float32)
    
    # Saturation calculation to distinguish white/gray from colored graphics
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    sat = max_c - min_c

    # Identify background pixels (high brightness & low saturation)
    white_bg_mask = (brightness > 195) & (sat < 50)
    
    # Create clean alpha mask
    clean_a = a.copy()
    clean_a[white_bg_mask] = 0

    # 2. Morphological shape cleanup (closing interior gaps & removing isolated noise)
    fg_binary = (clean_a > 20).astype(np.uint8) * 255

    # Remove tiny noise specks
    kernel_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    fg_clean = cv2.morphologyEx(fg_binary, cv2.MORPH_OPEN, kernel_open)

    # Fill small interior pinholes in decal shapes
    kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    fg_filled = cv2.morphologyEx(fg_clean, cv2.MORPH_CLOSE, kernel_close)

    # 3. Contour & Edge Smoothing (Vector-like anti-aliased edge smoothing)
    # Gaussian blur on binary mask followed by smooth thresholding creates anti-aliased, smooth edges
    blur_mask = cv2.GaussianBlur(fg_filled, (5, 5), 0)
    
    # Normalize alpha channel with smooth edge transitions
    alpha_float = blur_mask.astype(np.float32) / 255.0
    alpha_smooth = np.clip(alpha_float * 1.2, 0, 1) # Sharpen threshold transition
    final_a = (alpha_smooth * 255.0).astype(np.uint8)

    # 4. Color Enhancement & Sharpening
    # Sharpen graphic channels
    rgb = cv2.merge([b, g, r])
    kernel_sharpen = np.array([[0, -0.4, 0], [-0.4, 2.6, -0.4], [0, -0.4, 0]])
    rgb_sharpened = cv2.filter2D(rgb, -1, kernel_sharpen)
    rgb_final = np.clip(rgb_sharpened, 0, 255).astype(np.uint8)
    
    b_final, g_final, r_final = cv2.split(rgb_final)

    # Zero-out RGB values for fully transparent pixels to avoid border artifacts
    transparent = (final_a == 0)
    b_final[transparent] = 0
    g_final[transparent] = 0
    r_final[transparent] = 0

    # Merge cleaned RGBA image
    result = cv2.merge([b_final, g_final, r_final, final_a])

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cv2.imwrite(output_path, result)
    print(f"-> Created '{output_path}' from '{input_path}'")
    return True

def main():
    paints = [
        ("purplepaint.png", "purpleexp.png"),
        ("greenpaint.png", "greenexp.png"),
        ("redpaint.png", "redexp.png"),
    ]

    paints_dir = "public/paints"
    print("=" * 65)
    print(" Processing and refining paint graphics (smoothing & sharpening)...")
    print("=" * 65)

    for src_name, dst_name in paints:
        src_path = os.path.join(paints_dir, src_name)
        dst_path = os.path.join(paints_dir, dst_name)
        clean_and_enhance_paint(src_path, dst_path)

    print("=" * 65)
    print("Done! All exported paint graphics saved to 'public/paints/'.")

if __name__ == "__main__":
    main()
