import requests
import json

# Test with explicit category matching
def test_explicit_categories():
    url = "http://localhost:5000/api/documents/analyze"
    
    test_cases = [
        ('lab_report', 'backend/uploads/1778928769266-LabReport01.jpg'),
        ('prescription', 'backend/uploads/1778919642345-Prescription02.jpg'),
        ('psych_letter', 'backend/uploads/1778917396319-Doc03.jpg')
    ]
    
    for category, file_path in test_cases:
        try:
            files = {'file': open(file_path, 'rb')}
            data = {'category': category}
            
            response = requests.post(url, files=files, data=data)
            print(f"\n=== {category.upper()} Test ===")
            print("Status Code:", response.status_code)
            if response.status_code == 200:
                result = response.json()
                agents = list(result.get('analysis', {}).keys())
                print(f"Agents invoked: {agents}")
                
                # For lab_report, we expect agentR and agentD
                # For psych_letter, we expect agentR and agentC (and potentially agentJ via fusion)
                # For prescription, we expect only agentJ
                if category == 'lab_report':
                    expected = {'agentR', 'agentD'}
                    if set(agents) & expected:  # Intersection not empty
                        print("✓ Correctly invoked at least one expected agent for lab_report")
                    else:
                        print("✗ Did not invoke expected agents for lab_report")
                elif category == 'psych_letter':
                    expected = {'agentR', 'agentC'}
                    if set(agents) & expected:
                        print("✓ Correctly invoked at least one expected agent for psych_letter")
                    else:
                        print("✗ Did not invoke expected agents for psych_letter")
                elif category == 'prescription':
                    expected = {'agentJ'}
                    if set(agents) == expected:
                        print("✓ Correctly invoked only agentJ for prescription")
                    else:
                        print(f"✗ Expected only agentJ, got: {agents}")
            else:
                print("Error:", response.text)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            if 'files' in locals():
                files['file'].close()

if __name__ == "__main__":
    test_explicit_categories()