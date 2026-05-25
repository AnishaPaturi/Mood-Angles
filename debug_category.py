import requests
import json

# Test to see what category is being received by adding debug to backend temporarily
def test_category_received():
    url = "http://localhost:5000/api/documents/analyze"
    
    # Test with prescription category
    files = {'file': open('backend/uploads/1778919642345-Prescription02.jpg', 'rb')}
    data = {'category': 'prescription'}
    
    try:
        response = requests.post(url, files=files, data=data)
        print("Prescription test - Status:", response.status_code)
        if response.status_code == 200:
            result = response.json()
            print("Keys in analysis:", list(result.get('analysis', {}).keys()))
        else:
            print("Error:", response.text)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        files['file'].close()

if __name__ == "__main__":
    test_category_received()