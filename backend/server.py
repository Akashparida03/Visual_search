import uvicorn
import os # Import the os module
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    # Get the port from the environment variable Render provides
    port = os.getenv("PORT", 8000)) 
    uvicorn.run("main:app", host="0.0.0.0", port=port)
