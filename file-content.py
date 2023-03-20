import os
import csv
import subprocess

# Set the path to the repository
repo_path = "/home/shahab/EECS4481-Project-T5"

# Get the Git-tracked files using `git ls-files`
output = subprocess.check_output(["git", "ls-files"], cwd=repo_path)
files = output.decode('utf-8').strip().split("\n")

# Create a CSV file for output
output_file = "git_files.csv"
with open(output_file, "w", encoding='utf-8', newline='') as csv_file:
    writer = csv.writer(csv_file)
    writer.writerow(["Full Name", "Source Code"])

    # Loop through each file and write its full name and source code to the CSV
    for file in files:
        full_path = os.path.join(repo_path, file)

        # Skip image files
        if os.path.splitext(full_path)[1].lower() in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']:
            continue

        try:
            with open(full_path, "r", encoding='utf-8') as source_file:
                source_code = source_file.read()
        except UnicodeDecodeError:
            # Fallback to latin-1 encoding if utf-8 fails
            with open(full_path, "r", encoding='latin-1') as source_file:
                source_code = source_file.read()

        writer.writerow([full_path, source_code])
