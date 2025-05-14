import os
import torch

def configure_gpu():
    # PyTorch configuration

    # Check if GPU is available and print device details
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")

    # Print GPU details if available
    if device == "cuda":
        print(f"GPU name: {torch.cuda.get_device_name(0)}")
        print(f"Number of GPUs available: {torch.cuda.device_count()}")
        print(f"CUDA version: {torch.version.cuda}")
        
        # Get current memory usage
        current_memory = torch.cuda.memory_allocated(0) / (1024 ** 2)  # in MB
        total_memory = torch.cuda.get_device_properties(0).total_memory / (1024 ** 2)  # in MB
        print(f"Current GPU memory usage: {current_memory:.2f} MB / {total_memory:.2f} MB")
    else:
        print("No GPU available, using CPU")

    # Set device for PyTorch
    torch.device(device)
    if torch.cuda.is_available():
        try:
            # Enable memory growth for PyTorch (gradual memory allocation)
            torch.cuda.set_per_process_memory_fraction(0.5)  # Use up to 70% of available GPU memory
            torch.backends.cudnn.benchmark = True  # Enable automatic tuner
            print("✅ PyTorch GPU memory configuration set successfully")
        except Exception as e:
            print(f"❌ Error setting PyTorch GPU memory configuration: {e}")

