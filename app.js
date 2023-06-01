let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = 'd1f83022-98aa-4373-a2dd-8235a4e1041b'
let notFound = document.querySelector('.not_found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');

searchBtn.addEventListener('click', function (e) {
    e.preventDefault();

    //clear data 
    audioBox.innerHTML = '';
    notFound.innerText = '';
    defBox.innerText = '';
    //Get input data
    let word = input.value;
    // call API get data
    if (word === '') {
        alert('Word is required');
        return;
    }

    getData(word);
})


async function getData(word) {
    loading.style.display = 'block';
    //Ajax call
    const responce = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`);
    const data = await responce.json();


    //if emty result
    if (!data.length) {
        loading.style.display = 'none';

        notFound.innerText = 'No result found';
        return;
    }

    //if result is suggetions
    if (typeof data[0] === 'string') {
        loading.style.display = 'none';

        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean?'
        notFound.appendChild(heading);
        data.forEach(Element => {
            let suggetion = document.createElement('span');
            suggetion.classList.add('suggested');
            suggetion.innerText = Element;
            notFound.appendChild(suggetion);

        })
        return;
    }

    //result found
    loading.style.display = 'none';

    let defination = data[0].shortdef[0];
    defBox.innerText = defination;


    //sound
    const soundName = data[0].hwi.prs[0].sound.audio;
    if (soundName) {
        renderSound(soundName);
    }
    console.log(data);
}

function renderSound(soundName) {

    let subfolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);
}