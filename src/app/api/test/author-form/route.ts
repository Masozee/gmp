import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Author Form</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        form { display: grid; gap: 10px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select, textarea { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
        button { padding: 10px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .response { margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 4px; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <h1>Test Author Creation Form</h1>
      <p>This form will directly submit to the /api/authors endpoint</p>
      
      <form id="authorForm">
        <div>
          <label for="firstName">First Name*</label>
          <input type="text" id="firstName" name="firstName" required />
        </div>
        
        <div>
          <label for="lastName">Last Name*</label>
          <input type="text" id="lastName" name="lastName" required />
        </div>
        
        <div>
          <label for="email">Email*</label>
          <input type="email" id="email" name="email" required />
        </div>
        
        <div>
          <label for="phoneNumber">Phone Number</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" />
        </div>
        
        <div>
          <label for="organization">Organization</label>
          <input type="text" id="organization" name="organization" />
        </div>
        
        <div>
          <label for="category">Category*</label>
          <select id="category" name="category" required>
            <option value="AUTHOR">Author</option>
            <option value="BOARD">Board Member</option>
            <option value="STAFF">Staff</option>
            <option value="RESEARCHER">Researcher</option>
          </select>
        </div>
        
        <div>
          <label for="bio">Bio</label>
          <textarea id="bio" name="bio" rows="4"></textarea>
        </div>
        
        <div>
          <h3>Test Options</h3>
          <label>
            <input type="radio" name="submitType" value="json" checked /> 
            Submit as JSON
          </label>
          <label>
            <input type="radio" name="submitType" value="formData" /> 
            Submit as FormData
          </label>
        </div>
        
        <button type="submit">Create Author</button>
      </form>
      
      <div id="response" class="response" style="display: none;">
        <h3>Response:</h3>
        <pre id="responseContent"></pre>
      </div>
      
      <script>
        document.getElementById('authorForm').addEventListener('submit', async function(e) {
          e.preventDefault();
          
          const form = e.target;
          const submitType = form.querySelector('input[name="submitType"]:checked').value;
          const responseDiv = document.getElementById('response');
          const responseContent = document.getElementById('responseContent');
          
          try {
            responseDiv.style.display = 'block';
            responseContent.textContent = 'Submitting...';
            
            let requestBody;
            let headers = {};
            
            if (submitType === 'json') {
              // Submit as JSON
              headers = {
                'Content-Type': 'application/json'
              };
              
              // Get form data as object
              const formData = new FormData(form);
              const jsonData = {};
              
              formData.forEach((value, key) => {
                if (key !== 'submitType') {
                  jsonData[key] = value;
                }
              });
              
              requestBody = JSON.stringify(jsonData);
            } else {
              // Submit as FormData
              const formData = new FormData(form);
              formData.delete('submitType');
              requestBody = formData;
            }
            
            const response = await fetch('/api/authors', {
              method: 'POST',
              headers,
              body: requestBody
            });
            
            const data = await response.json();
            
            responseContent.textContent = JSON.stringify(data, null, 2);
            
            if (response.ok) {
              responseContent.style.color = 'green';
            } else {
              responseContent.style.color = 'red';
            }
          } catch (error) {
            responseContent.textContent = 'Error: ' + error.message;
            responseContent.style.color = 'red';
          }
        });
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
} 