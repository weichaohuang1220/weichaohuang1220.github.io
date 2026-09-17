"""Run the repository's RMSNorm layer on two scaled feature vectors.

Usage: python rmsnorm_demo.py /path/to/llm-from-scratch
Requires Python 3.10+ and PyTorch 2.x. No model weights or API key required.
"""

import runpy
import sys
from pathlib import Path

import torch


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python rmsnorm_demo.py /path/to/llm-from-scratch")
    source = Path(sys.argv[1]) / "transformer" / "01_rmsnorm.py"
    RMSNorm = runpy.run_path(str(source))["RMSNorm"]
    inputs = torch.tensor([[3.0, 4.0], [30.0, 40.0]])
    with torch.inference_mode():
        outputs = RMSNorm(dim=2, eps=1e-5)(inputs)
    expected = torch.tensor([[0.848528, 1.131371], [0.848528, 1.131371]])
    torch.testing.assert_close(outputs, expected, rtol=1e-5, atol=1e-6)
    for before, after in zip(inputs.tolist(), outputs.tolist()):
        print(f"{before} -> [{after[0]:.4f}, {after[1]:.4f}]")
    print("PASS: the two scaled inputs normalize to approximately the same vector.")


if __name__ == "__main__":
    main()
