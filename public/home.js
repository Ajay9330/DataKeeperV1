async function fetchpdfyt(){
    var d=[];
    try{
        const r= await fetch('/getpdfyt');
        const pdfyt=await r.json();
        // console.log(r,pdfyt);
        const cont= document.getElementsByClassName('pdfytcont')[0];
        cont.innerHTML='';
        pdfyt.forEach(element => {
            const pdfytdiv=document.createElement('div');
            const delbt=document.createElement('button');
            pdfytdiv.innerHTML=(element);
            delbt.addEventListener('click', () => delpdfyt(element));

            delbt.textContent="Delete";
            delbt.classList.add('del');
            pdfytdiv.appendChild(delbt);
            cont.appendChild(pdfytdiv);
        });

    }catch{
        console.log("error fetching pdfyt");
    }

    
}

async function addpdfyt(pdfytContent) {
     await fetch('/addpdfyt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pdfyt: pdfytContent })})
        fetchpdfyt(); 
}

async function delpdfyt(pdfytContent) {
    try {
        const response = await fetch('/deletepdfyt', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pdfyt: pdfytContent })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        fetchpdfyt(); // Fetch PDFYTs after successful deletion
    } catch (error) {
        console.error('Error deleting PDFYT:', error);
    }
}


fetchpdfyt();

