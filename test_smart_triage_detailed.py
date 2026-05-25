import requests
import json

# Test the smart triage functionality with debugging
def test_document_analysis():
    url = "http://localhost:5000/api/documents/analyze"
    
    # Test with a lab report file and category
    files = {'file': open('backend/uploads/1778928769266-LabReport01.jpg', 'rb')}
    data = {'category': 'lab_report'}
    
    try:
        response = requests.post(url, files=files, data=data)
        print("Status Code:", response.status_code)
        print("Response:", json.dumps(response.json(), indent=2))
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        files['file'].close()

# Test with prescription category
def test_prescription():
    url = "http://localhost:5000/api/documents/analyze"
    
    files = {'file': open('backend/uploads/1778919642345-Prescription02.jpg', 'rb')}
    data = {'category': 'prescription'}
    
    try:
        response = requests.post(url, files=files, data=data)
        print("\n=== Prescription Test ===")
        print("Status Code:", response.status_code)
        print("Response:", json.dumps(response.json(), indent=2))
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        files['file'].close()

# Test with psych_letter category
def test_psych_letter():
    url = "http://localhost:5000/api/documents/analyze"
    
    files = {'file': open('backend/uploads/1778917396319-Doc03.jpg', 'rb')}
    data = {'category': 'psych_letter'}
    
    try:
        response = requests.post(url, files=files, data=data)
        print("\n=== Psych Letter Test ===")
        print("Status Code:", response.status_code)
        print("Response:", json.dumps(response.json(), indent=2))
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        files['file'].close()

if __name__ == "__main__":
    test_document_analysis()
    test_prescription()
    test_psych_letter()