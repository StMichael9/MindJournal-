# MindJournal-

A personal journaling application with a JavaScript/CSS frontend and a Python backend.

## Tech Stack

- **Frontend:** JavaScript, CSS
- **Backend:** Python
- **Repository:** [StMichael9/MindJournal-](https://github.com/StMichael9/MindJournal-)

## Project Structure

```text
MindJournal-/
├── backend/
│   ├── requirements.txt
│   └── ...
├── frontend/
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites

- **Python 3.9+** (recommended)
- **pip**
- (Optional) **Node.js + npm** if your frontend requires package scripts

---

## Backend Setup

### 1) Navigate to backend folder

```bash
cd backend
```

### 2) Create a virtual environment

#### Windows (PowerShell/CMD)

```bash
python -m venv venv
```

#### macOS/Linux

```bash
python3 -m venv venv
```

### 3) Activate the virtual environment

#### Windows (PowerShell/CMD)

```bash
.\venv\Scripts\activate
```

#### macOS/Linux

```bash
source venv/bin/activate
```

### 4) Install dependencies

```bash
pip install -r requirements.txt
```

### 5) Run the backend

> Update this command to match your backend entry file (e.g., `app.py`, `main.py`, Flask, FastAPI, etc.)

```bash
python app.py
```

---

## Frontend Setup (if applicable)

If you have a separate frontend app:

```bash
cd frontend
npm install
npm run dev
```

> Replace `npm run dev` with your actual start script if different.

---

## Environment Variables

If your project uses secrets or environment configuration, create a `.env` file in the appropriate directory:

```env
# Example
SECRET_KEY=your_secret_key_here
DEBUG=True
```

> Never commit real secrets to GitHub.

---

## Troubleshooting

### Virtual environment activation fails on Windows

If script execution is blocked in PowerShell, run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then re-activate:

```bash
.\venv\Scripts\activate
```

### `pip` command not found

Try:

```bash
python -m pip install -r requirements.txt
```

or

```bash
python3 -m pip install -r requirements.txt
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## License

Add your license here (e.g., MIT) or include a `LICENSE` file.
