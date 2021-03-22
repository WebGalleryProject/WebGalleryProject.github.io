import firebase from "firebase/app";
import "firebase/storage";
import "firebase/auth";
import "firebase/database";
import { upload } from "./upload";

const row = document.querySelector(".rowow");
const buf = [];
const image_names = ['Солнечный кот','Свежая волна','Сила жизни','Ветер перемен','Тенерифе','Маяк, фонарь, скамейка','Горное озеро','Гоулбой залив','Загородный домик','Японский мостик','Яблоневый сад','Васильки в зеркале озера','Осень, краса','Приятных снов','Маки, начало лета','Апрель, 13 число','Закат','Сентябрь, золото берёз','Анапа. Море. Кипарисы']
const firebaseConfig = {
  apiKey: "AIzaSyCXuZ062kAptKaseCvPyw1d7C24pN7tTIU",
  authDomain: "gallery-ef278.firebaseapp.com",
  projectId: "gallery-ef278",
  storageBucket: "gallery-ef278.appspot.com",
  messagingSenderId: "542624774447",
  appId: "1:542624774447:web:695edea6e4bc3c526b49da",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const auth = firebase.auth();

const loginForm = document.querySelector('#login-form1')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    var user = firebase.auth().currentUser;

    const email = loginForm['login-email1'].value
    const password = loginForm['login-password1'].value

    auth.signInWithEmailAndPassword(email, password).then(cred => {

    }).then(() => {
        // loginForm['login-email'].value = ''
        // loginForm['login-password'].value = ''
        
        setTimeout(document.querySelector('#close-modal1').click(), 2000)
    }).then(() => {
        if (user) {
            const loginBtn = document.querySelector('#login-btn1')
            loginBtn.style.display = 'none'
            upload('#file1', {
                multi: true,
                accept: ['.png', '.jpeg', '.jpg', '.gif'],
                onUpload(files) {
                    files.forEach(file => {
                        const ref = storage.ref(`images/${file.name}`)
                        const task = ref.put(file)
            
                        task.on('state_changed', snapshot => {
                            // const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            // console.log(percentage)
                        }, error => {
                            // console.log(error)
                        }, () => {
                            // console.log('Complete')
                            task.snapshot.ref.getDownloadURL().then(url => {
                                imgURL.push(url)
                                initSlider();
                                return imgURL;
                            })
                        })
                    });
                }
            });
          } 
    }).catch(() => {
        loginForm['login-password1'].value = ''
    })
    document.querySelector('#file1').style.display = 'block'
})


function initSlider(callback) {
  let storageRef = storage.ref();
  let result;

  row.innerHTML = "";
  let listRef = storageRef.child("images/");
  listRef
    .listAll()
    .then((res) => {
      res.prefixes.forEach((folderRef) => {
      });
      res.items.forEach((itemRef, i) => {

        itemRef.getDownloadURL().then((url) => {
          var xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = (event) => {
            let blob = xhr.response;
          };
          xhr.open("GET", url);
          xhr.send();
          buf.push(url.match(/..*%2F(.*?)\.jpg/));
          buf.sort((a, b) => a[1] - b[1]);
          if (buf.length === res.items.length) {
            buf.forEach((item, i) => {
              let block = `
          <div class="work">
 
              <img src="${item.input}" alt="" class="image-card">
              <div>
                <h4>${image_names[i]}</h4>
              </div>
          </div>
          `;
              result = document.createElement("li");
              result.innerHTML = block;
              result.classList.add("span3");
              result.style.backgroundSize = "contain";
              result.style.backgroundRepeat = "no-repeat";
              row.appendChild(result);
            });
          }
        });
      });
    })
    .catch((error) => {});


    const modal = document.querySelector(".my-modal1");
    const modalImg = document.querySelector('.my-modal-content1')
    row.addEventListener("click", (e) => {
      let target = e.target;
  
      if (target.tagName === "IMG") {
        // console.log(target.src)
        modal.style.display = "block";
        // target.src = this.src;
        modalImg.src = target.src
        document.body.style.overflow = 'hidden';
  // modalImg.src = this.src;
  var span = document.getElementsByClassName("my-close1")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  document.body.style.overflow = 'visible';
}
      }
    });
    
}
initSlider();


