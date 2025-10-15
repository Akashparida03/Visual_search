import uvicorn
import os # Import the os module

if __name__ == "__main__":
    # Get the port from the environment variable Render provides
    port = int(os.environ.get("PORT", 8000)) 
    uvicorn.run("main:app", host="0.0.0.0", port=port)
