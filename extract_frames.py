import argparse
import os
import sys
import cv2

def extract_frames(video_path, output_dir, start_time=0.0, end_time=None, step=1, format='jpg', quality=95):
    """
    Extracts frames from a video file and saves them to an output directory.
    
    :param video_path: Path to the input video file.
    :param output_dir: Directory where extracted frames will be saved.
    :param start_time: Start time in seconds (default: 0.0).
    :param end_time: End time in seconds (default: None, process until end of video).
    :param step: Extract every N-th frame (default: 1, i.e., all frames).
    :param format: Image format for extracted frames ('jpg', 'png', 'webp').
    :param quality: Compression quality for JPEG (1-100) or WebP (1-100).
    """
    if not os.path.exists(video_path):
        print(f"Error: Video file '{video_path}' not found.", file=sys.stderr)
        return False

    os.makedirs(output_dir, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Could not open video file '{video_path}'.", file=sys.stderr)
        return False

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    duration = total_frames / fps if fps > 0 else 0

    start_frame = max(0, int(start_time * fps))
    end_frame = int(end_time * fps) if end_time is not None else total_frames
    end_frame = min(total_frames, end_frame)

    if start_frame >= total_frames:
        print(f"Error: Start time {start_time}s exceeds total video duration ({duration:.2f}s).", file=sys.stderr)
        cap.release()
        return False

    print("=" * 55)
    print(" Video Information:")
    print(f"  File Path     : {video_path}")
    print(f"  Output Dir    : {output_dir}")
    print(f"  Resolution    : {width} x {height}")
    print(f"  FPS           : {fps:.2f}")
    print(f"  Total Frames  : {total_frames}")
    print(f"  Video Length  : {duration:.2f} seconds")
    print(f"  Start Time    : {start_time:.2f}s (Frame {start_frame + 1})")
    if end_time is not None:
        print(f"  End Time      : {end_time:.2f}s (Frame {end_frame})")
    print(f"  Sampling Step : Every {step} frame(s)")
    print("=" * 55)

    if start_frame > 0:
        cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)

    digits = max(4, len(str(total_frames)))
    saved_count = 0
    frame_idx = start_frame
    frames_to_process = end_frame - start_frame

    ext = format.lstrip('.').lower()
    encode_params = []
    if ext in ['jpg', 'jpeg']:
        encode_params = [cv2.IMWRITE_JPEG_QUALITY, quality]
    elif ext == 'webp':
        encode_params = [cv2.IMWRITE_WEBP_QUALITY, quality]
    elif ext == 'png':
        encode_params = [cv2.IMWRITE_PNG_COMPRESSION, 3]

    while frame_idx < end_frame:
        ret, frame = cap.read()
        if not ret:
            break

        if (frame_idx - start_frame) % step == 0:
            saved_count += 1
            filename = f"frame_{saved_count:0{digits}d}.{ext}"
            filepath = os.path.join(output_dir, filename)
            cv2.imwrite(filepath, frame, encode_params)

            print(f"\rExtracting frame {saved_count} / {frames_to_process // step} (Video frame {frame_idx + 1}/{total_frames})...", end="", flush=True)

        frame_idx += 1

    cap.release()
    print(f"\n\nDone! Extracted {saved_count} frames to '{output_dir}'.")
    return True

if __name__ == "__main__":
    # Check default video paths
    default_video = "public/motion.mp4" if os.path.exists("public/motion.mp4") else "motion.mp4"
    default_output = "public/frames"

    parser = argparse.ArgumentParser(description="Extract frames from motion.mp4 or any video file.")
    parser.add_argument("-i", "--input", default=default_video, help="Path to input video (default: public/motion.mp4)")
    parser.add_argument("-o", "--output", default=default_output, help="Output folder for frames (default: public/frames)")
    parser.add_argument("-st", "--start", "--start-time", type=float, default=0.0, help="Initial duration to start extracting in seconds (default: 0.0)")
    parser.add_argument("-et", "--end", "--end-time", type=float, default=None, help="End time in seconds (default: end of video)")
    parser.add_argument("-s", "--step", type=int, default=1, help="Extract every N-th frame (default: 1)")
    parser.add_argument("-f", "--format", default="jpg", choices=["jpg", "jpeg", "png", "webp"], help="Output image format (default: jpg)")
    parser.add_argument("-q", "--quality", type=int, default=95, help="JPEG/WebP quality 1-100 (default: 95)")

    args = parser.parse_args()

    extract_frames(
        video_path=args.input,
        output_dir=args.output,
        start_time=args.start,
        end_time=args.end,
        step=args.step,
        format=args.format,
        quality=args.quality
    )
