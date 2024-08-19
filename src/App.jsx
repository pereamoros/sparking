import './css/style.css'
import characters from './dades/characters'
import { useState, useRef, useEffect, useCallback } from 'react';

function App() {
  const [count, setCount] = useState(32);
  const [inputValue, setInputValue] = useState(0);
  const resizableRef = useRef(null);

  useEffect(() => {
    const newResizableRef = resizableRef.current
    const gridItems = document.querySelectorAll('.gallery-img');

  
    const handleResize = () => {
      // eliminem classes anteriors i tornem a aplicar càlcul de cuadrícula.
      // delete 
      gridItems.forEach(item => {
        removeLastStaggeredClass(item)
      });
      getRowChange()
    };

    // we create a new observer to see any changes
    // if there is a size change we call handleResize function
    const resizeObserver = new ResizeObserver(handleResize);
    if (newResizableRef) {
      resizeObserver.observe(newResizableRef);
    }

    // clean the observer 
    return () => {
      if (newResizableRef) {
        resizeObserver.unobserve(newResizableRef);
      }
    };

  });

  function getRowChange() {
    const gridItems = document.querySelectorAll('.gallery-img');
    let previousTop = 0;
    let cont = 0;
    // we want to avoid first row
    const firstTop = gridItems[0].getBoundingClientRect().top;
    gridItems.forEach(item => {
      const currentTop = item.getBoundingClientRect().top;
      if (currentTop !== previousTop && currentTop !== firstTop) {
        // there's a row change --> we update cont and apply new class
        previousTop = currentTop;
        cont++
        removeLastStaggeredClass(item) // --> we remove any other staggered class before assigning new one
        item.classList.toggle(`staggered-${cont}`)
      } else if(currentTop === previousTop) {
        // they are on the same row, so they share same class
        removeLastStaggeredClass(item)
        item.classList.toggle(`staggered-${cont}`)
      }

    });
  }

  function removeLastStaggeredClass(element) {
    if (!element || !element.classList) return;
    const classes = Array.from(element.classList);
    const isStaggered = classes.some(c => c.startsWith('staggered-'));
    if (isStaggered) {
      const lastClass = classes.pop();
      element.classList.remove(lastClass);
    }
  }

  // ARRAY DE TOTS ELS PERSONATGES
  function getCharacterNames(characters) {
    let result = [];
    for (let character of characters) {
      result.push(character.id);
        if (character.transformacions) {
          for (let transformation of character.transformacions) {
            result.push(transformation.id);
          }
        }
    }
    return result;
  }
  let allCharacters = getCharacterNames(characters);

  // ORDRE DE LES FILES
  const personajes = `
  empty-1 empty-2 jeice guldo yamcha videl tenshinhan nail empty-9 goku-black goku-black-ssj-rose master-roshi-max-power master-roshi chaos beerus empty-16 empty-17
  empty-18 burter ginyu recoome babidi piccolo frieza-1st-form frieza-2nd-form frieza-super fused-zamasu fused-zamasu-half-corrupted goku-mid vados champa whis empty-33 empty-34
  empty-35 kale krilin gohan-teen dyspo spopovitch piccolo-early frieza-100 golden-frieza cell-imperfect android-18 zamasu goku-mid-ssj mecha-frieza king-cold roasie empty-51
  kale-berserk kale-ssj gohan-kid gohan-teen-ssj gohan-teen-ssj2 nappa frieza frieza-3rd-form cell-perfect cell-semiperfect vegeta-mid-ssj super-vegeta trunks super-trunks ribrianne kakunza empty-68
  kefla kefla-ssj gohan-ozaru dabura future-gohan hit vegeta-saiyan vegeta-saiyan-ozaru goku-ultra-instinct cell-super-perfect obni vegeta-mid bardock trunks-ssj tagoma shisami magetta
  caulifla kefla-ssj2 super-buu future-gohan-ssj mr-satan kibitoshin goku-early goku-ultra-instinct-sign vegeta-super-ssj vegeta-super kahseral ganos-transformed trunks-kid gotenks goten botamo empty-102
  caulifla-ssj2 vegeta-end super-buu-gohan super-buu-gotenks majin-buu evil-buu shin jaco gogeta-ssj-blue vegeta-super-ssj-blue vegeta-super-ssj-god ganos trunks-kid-ssj gotenks-ssj gotenks-ssj3 goten-ssj frieza-soldier
  vegeta-end-ssj2 vegeta-end-ssj kid-buu goku-end-ssj3 frost-1st-form frost-3rd-form goku-super-ssj-blue goku-super-ssj-god gogeta gogeta-ssj android-17-super mai great-saiyaman gohan-adult gohan-adult-ssj2 ultimate-gohan empty-136
  empty-137 majin-vegeta vegetto goku-end-ssj2 goku-end frost goku-super-ssj goku-super uub aniraza android-17 cabba trunks-super gohan-adult-ssj broly broly-ssj-full-power empty-153
  empty-154 vegetto-ssj vegetto-ssj-blue goku-end-ssj toppo toppo-god-of-destruction android-21 android-21-transformed jiren-full-power jiren cabba-ssj trunks-super-ssj dr-gero cell-jr broly-ssj empty-169 
  empty-171 empty-172 zarbon zarbon-transformed android-16 future-trunks-ssj future-trunks dodoria empty-179 yajirobe saibaman raditz android-19 bergamo cui empty-186 empty-187
  `.trim().split('\n');
  

  const personajesNumeros = {};
  let cont = 0;
  personajes.forEach((fila, i) => {
    fila.split(' ').forEach((personaje, j) => {
      if (personaje !== '.') {
        const numero = i * 17 + j + 1;
        personajesNumeros[personaje] = numero;
      } else {
        personajesNumeros['undefined'+ cont] = i * 17 + j + 1;
        cont++;
      }
    });
  });

  // Convertir personajesNumeros en un array de [personaje, numero]
  const personajesArray = Object.entries(personajesNumeros);
  // Ordenar el array basado en el valor numérWco
  personajesArray.sort((a, b) => a[1] - b[1]);
  // Mapear el array ordenado para obtener solo los personajes
  const personajesOrdenados = personajesArray.map(item => item[0]);
  let gridCharacters = personajesOrdenados;


  // POPULATE MODAL
  const modalRef = useRef();
  const imgGameplayRef = useRef();
  const imgCharRef = useRef();
  const charName = useRef();
  const prevChar = useRef();
  const nextChar = useRef();

  const populateModal = (selectedChar) => {
    modalRef.current.style.display = "flex";
    // check if there is an icon image
    imgCharRef.current.src = "./src/assets/"+ selectedChar +"/"+ selectedChar +".png";
    imgGameplayRef.current.src = "./src/assets/"+ selectedChar +"/gameplay.jpg";
    charName.current.innerHTML = getName(characters, selectedChar);
    let transformations = getTransformations(characters, selectedChar);

    // remove previous transformations
    let previousTransformations = modalRef.current.querySelector('.transformations');
    if (previousTransformations) {
      previousTransformations.remove();
    }
    

    if (transformations.length > 1) {
      let transformationsDiv = document.createElement('div');
      transformationsDiv.classList.add('transformations');
      for (let i = 0; i < transformations.length; i++) {
        let transformationDiv = document.createElement('div');
        transformationDiv.classList.add('transformation');

        if(transformations[i] === selectedChar) {
          transformationDiv.classList.add('transformation-selected');
        }

        let img = document.createElement('img');
        img.src = './src/assets/' + transformations[i] + '/icon.png';
        img.onclick = () => populateModal(transformations[i]);

        transformationDiv.appendChild(img);
        transformationsDiv.appendChild(transformationDiv);
      }
      modalRef.current.querySelector('.modal-content').appendChild(transformationsDiv);
    }

    // add event listeners to prev and next buttons
    let index = allCharacters.indexOf(selectedChar);
    prevChar.current.onclick = () => {
      if (index > 0) {
        populateModal(allCharacters[index - 1]);
      }
    }
    nextChar.current.onclick = () => {
      if (index < allCharacters.length - 1) {
        populateModal(allCharacters[index + 1]);
      }
    }
    // add keyboard navigation
    document.onkeydown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevChar.current.click();
      } else if (e.key === 'ArrowRight') {
        nextChar.current.click();
      } else if (e.key === 'Escape') {
        closeModal();
      }      
    }


  }

  function getTransformations(characters, id) {
    let character = characters.find(character => character.id === id);
    if (!character) {
        for (let char of characters) {
            if (char.transformacions) {
                let transformation = char.transformacions.find(t => t.id === id);
                if (transformation) {
                    character = char;
                    break;
                }
            }
        }
    }
    if (!character) {
        return null;
    }
    let result = [character.id];
    if (character.transformacions) {
        result = result.concat(character.transformacions.map(t => t.id));
    }
    return result;
  }

  function getName(array, id) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return array[i].nom;
        }
        for (let j = 0; j < array[i].transformacions.length; j++) {
            if (array[i].transformacions[j].id === id) {
                return array[i].transformacions[j].nom;
            }
        }
    }
    return null;
  }


  // CLOSE MODAL
    const closeModal = useCallback(() => {
      if (modalRef.current) {
        modalRef.current.style.display = "none";
      }
    }, []);

    window.onclick = function(event) {
      if (event.target == modalRef.current) {
        closeModal();
      }
    }
  // 

  return (
    <>
      <h1>Dragon Ball Sparking Zero</h1>

      <div className='gallery' ref={resizableRef}>
        {
          gridCharacters.map((_, index) => (
            <div className="gallery-img" key={index} data-char={gridCharacters[index]} onClick={() => populateModal(gridCharacters[index])}>
              {/* <img 
                src={`./src/assets/${gridCharacters[index]}/icon.png`} 
                onError={(e) => {
                  e.target.onerror = null; // Previene la recursión en caso de que gameplay.jpg también esté ausente
                  e.target.src = `./src/assets/${gridCharacters[index]}/gameplay.jpg`;
                }} 
                alt="Character"
              /> */}
              <style>
                {`
                  .gallery-img[data-char=${gridCharacters[index]}]:before {
                    background-image: url(./src/assets/${gridCharacters[index]}/icon.png), url(./src/assets/${gridCharacters[index]}/gameplay.jpg);
                    background-image: url(./src/assets/${gridCharacters[index]}/gameplay.jpg);
                    background-image: url(./src/assets/${gridCharacters[index]}/icon.png);
                  }
                `}
              </style>
            </div>
          ))
        }
      </div>

      <div className="modal" ref={modalRef}>
        <div ref={prevChar} className="arrow-nav">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M15 6l-6 6l6 6" />
          </svg>
        </div>
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <img ref={imgCharRef} id="selected-char"/>
          <img ref={imgGameplayRef} />
          <div ref={charName} className='char-name'></div>
        </div>
        <div ref={nextChar} className="arrow-nav">
          <svg  xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 6l6 6l-6 6" />
          </svg>
        </div>
      </div>
    </>
  )
}

export default App