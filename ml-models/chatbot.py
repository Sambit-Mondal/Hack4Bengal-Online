import os
import time
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_chatgroq_response(prompt, model="llama3-70b-8192"):
    """Get response from Groq API"""
    try:
        messages = [
            {
                "role": "system",
                "content": """You are a specialized assistant focused STRICTLY on land registration documents and processes.
                You ONLY help people understand and prepare documents for land registration.
                Explain land registration processes in simple language and provide step-by-step guidance.
                Be empathetic and helpful, but REFUSE to answer any questions not directly related to land registration,
                land ownership documentation, or the specific paperwork required for land transactions.
                If asked about anything else, politely redirect the conversation back to land registration topics.
                Your purpose is exclusively to provide accessible information about land rights and registration documents."""
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
        
        # Stream the response
        completion = client.chat.completions.create(
            messages=messages,
            model=model,
            temperature=0.5,
            max_tokens=1024,
            stream=True,
        )
        
        # For streaming, we return the generator directly
        return completion
    except Exception as e:
        return f"An error occurred: {str(e)}"

def print_with_delay(text, delay=0.01):
    """Print text with a typewriter effect"""
    for char in text:
        print(char, end='', flush=True)
        time.sleep(delay)
    print()

def show_welcome_message():
    """Display welcome message and introduction"""
    print("\n" + "=" * 80)
    print("LAND REGISTRATION DOCUMENT ASSISTANT".center(80))
    print("=" * 80)
    print("\nThis chatbot helps you understand and prepare land registration documents.")
    print("\nFeatures:")
    print("- Simple explanations of land registration processes")
    print("- Guidance on required documents")
    print("- Information about your land rights")
    print("- Assistance with filling out forms")
    print("\nNote: This tool provides information only and does not replace legal advice.")
    print("\nCommon questions you can ask:")
    print("1. What documents do I need for land registration?")
    print("2. How do I verify my land ownership?")
    print("3. What is the process for land mutation?")
    print("4. How much does land registration cost?")
    print("5. How can I check if my land is already registered?")
    print("\nType 'exit', 'quit', or 'bye' to END the conversation.")
    print("\n" + "-" * 80)

def main():
    show_welcome_message()
    
    # Initial greeting
    initial_message = "Hello! I'm your Land Registration Assistant. I can help you understand and prepare documents for registering your land. How can I assist you today?"
    print("\nAssistant: ", end="")
    print_with_delay(initial_message)
    
    # Main chat loop
    while True:
        user_input = input("\nYou: ")
        
        # Exit condition
        if user_input.lower() in ["exit", "quit", "bye"]:
            print("\nAssistant: Thank you for using the Land Registration Assistant. Goodbye!")
            break
        
        # Get and display response
        print("\nAssistant: ", end="")
        
        # Get streaming response
        completion = get_chatgroq_response(user_input)
        
        # Handle different types of responses
        if isinstance(completion, str):
            # If there was an error, print it
            print(completion)
        else:
            # Stream the response in real time
            try:
                for chunk in completion:
                    if chunk.choices[0].delta.content:
                        print(chunk.choices[0].delta.content, end="", flush=True)
            except Exception as e:
                print(f"\nError while streaming response: {str(e)}")
        
        print("\n" + "-" * 80)

if __name__ == "__main__":
    main()