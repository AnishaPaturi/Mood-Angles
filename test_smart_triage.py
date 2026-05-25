import requests
import json

# Test the smart triage functionality
def test_document_analysis():
    url = "http://localhost:5000/api/documents/analyze"
    
    # Test with a lab report file and category
    files = {'file': open('backend/uploads/1778928769266-LabReport01.jpg', 'rb')}
    data = {'category': 'lab_report'}
    
    try:
        response = requests.post(url, files=files, data=data)
        print("Status Code:", response.status_code)
        print("Response:", json.dumps(response.json(), indent=2))
        
        # Check which agents were called based on the response
        result = response.json()
        if 'analysis' in result:
            analysis = result['analysis']
            print("\nAgents that were invoked:")
            for agent in analysis.keys():
                print(f"- {agent}")
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        files['file'].close()

if __name__ == "__main__":
    test_document_analysis()