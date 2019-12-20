let url = "https://api.github.com/users/pedelriomarron/repos";
let rrss = [
  { href: "https://github.com/pedelriomarron", icon: "fab fa-github", class: "" },
  { href: "https://www.linkedin.com/in/pedelriomarron/", icon: "fab fa-linkedin", class: " hover:text-blue-500" },
  { href: "https://www.npmjs.com/~pedelriomarron", icon: "fab fa-npm", class: "hover:text-red-800" }

]
const menu = document.getElementById("menu");
const toggle = () => menu.classList.toggle("hidden");



window.onload = function () {
  basic()
  createFooter(rrss, "social_footer")
  addSlowHref()
  cargarRepos(url)






}



const cargarRepos = async (url) => {
  let data = await request("GET", url);

  let repos = JSON.parse(data.target.response)
  let mensaje = "";
  let reposElement = document.getElementById("repos");
  removeAllChilds(reposElement); //sm:flex-1
  repos.map(async (repo) => {

    let authors = await request("GET", repo.contributors_url);
    authors = JSON.parse(authors.target.response);
    let msj_authors = "";
    authors.map(author => {
      msj_authors += `<a class="hover:text-black" href="${author.html_url}">${author.login}</a> `;
    });
    let config = await request("GET", `https://raw.githubusercontent.com/${repo.full_name}/master/config/config`)


    //console.log(config.target.response)
    //  config = JSON.parse(config.target.response)
    //console.log(config.target.response)
    let languagesURL = `https://api.github.com/repos/${repo.full_name}/languages`;
    let a = JSON.parse(config.target.response)
    let data = a[0];

    let languages = await request("GET", languagesURL)
    languages = JSON.parse(languages.target.response)
    languages = Object.keys(languages)
    let msj_lan = ""
    languages.map(lan => {
      msj_lan += `<span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#${lan}</span>`
    })


    if (data.active) {
      let img = `https://raw.githubusercontent.com/${repo.full_name}/master/config/preview.png`
      if (repo.homepage == null) repo.homepage = repo.svn_url
      mensaje += createCard({ homepage: repo.homepage, desc: repo.description, img, url: repo.svn_url, name: repo.name, languges: msj_lan })
      reposElement.innerHTML = mensaje;
    }

  });
}



const createCard = (data) => {
  return ` 
        <div class="lg:w-1/4  md:w-1/3 p-3 my-3 md:opacity-50 sm:opacity-100   hover:opacity-100 ">
          <div class="rounded shadow-lg  bg-gray-200  ">
            <a class="cursor-pointer" href="${data.homepage}"><img class="w-full  bg-black cursor-pointer" src="${data.img}" alt=""> </a>    
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2"> <a class="capitalize" href="${data.url}  ">${capitalizar(data.name)}</a></div>
                <p class="text-gray-700 text-base">
                  ${data.desc}
                </p>
              </div>
             <div class="px-6 py-4">
              ${data.languges} 
            </div>
          </div>
        </div>`;
}


const basic = () => {
  document.getElementById("btnToggle").click();
  document.getElementById(
    "footer_year"
  ).innerHTML = new Date().getFullYear();
  document.getElementById("brand_nav").innerHTML = "Pedro del Río";
}

function toggleModal() {
  const modal = document.querySelector('.modal')
  modal.classList.toggle('opacity-0')
  modal.classList.toggle('pointer-events-none')
}

function capitalizar(str) {
  //Creamos las reglas
  var map = {
    '-': '_',
    ' ': '-',
  };
  str = str.toLowerCase();
  for (var pattern in map) {
    str = str.replace(new RegExp(map[pattern], 'g'), pattern);
  };
  return str.trim();
};

const addSlowHref = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
}


const createFooter = (list, id) => {
  let footer1 = createElement("div", { class: "px-6 text-3xl text-gray-500" })
  list.map(icon => {
    let a = createElement("a", { class: `hover:text-gray-700 p-2 ${icon.class}`, href: icon.href })
    let i = createElement("i", { class: icon.icon })
    a.appendChild(i)
    footer1.appendChild(a)
  })
  document.getElementById(id).appendChild(footer1)
}