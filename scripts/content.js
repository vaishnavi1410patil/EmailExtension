const insertgmail = (content) => {
    const elements = document.getElementsByClassName('Am Al editable LW-avf tS-tW');

    if (elements.length === 0) {
    return;
    }

    const element = elements[0];
    
    element.childNodes.forEach((element) => {
        element.remove();
    });

    const splitContent = content.split('\n');

    splitContent.forEach((content) => {
        const p = document.createElement('p');
      
        if (content === '') {
          const br = document.createElement('br');
          p.appendChild(br);
        } else {
          p.textContent = content;
        }
      
    
        element.appendChild(p);
    });
    return true;
}






const insertoutlook = (content) => {
   
  

  const parent = document.getElementById('editorParent_1');
  const host = parent.children[0];

  host.childNodes.forEach((element) => {
    element.remove();
  });

  const splitContent = content.split('\n');

  splitContent.forEach((content) => {
      const div = document.createElement('div');
      div.className = "elementToProof";
      const span = document.createElement('span');
      span.style = "font-family: Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);";
      span.className = "elementToProof";
      div.appendChild(span);
      if (content === '') {
        const br = document.createElement('br');
        span.appendChild(br);
      } else {
        span.textContent = content;
      }
    
       
      host.appendChild(div);
  });
  return true;
}





chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {

    if (request.message === 'gmail') {
      const { content } = request;

      const result = insertgmail(content);
			
      if (!result) {
        sendResponse({ status: 'failed' });
      }

      sendResponse({ status: 'success' });
    }

    else if (request.message === 'outlook') {
      const { content } = request;

      const result = insertoutlook(content);
			
      if (!result) {
        sendResponse({ status: 'failed' });
      }

      sendResponse({ status: 'success' });
    }
  }
);