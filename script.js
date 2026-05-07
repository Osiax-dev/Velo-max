function alerte() {
  alert("Découvrez nos vélos haut de gamme 🚴‍♂️ !");
}
// Panier stocké dans localStorage
let panier = JSON.parse(localStorage.getItem("panier")) || [];

// Ajouter un produit au panier
function ajouterAuPanier(nom, prix) {
  panier.push({ nom, prix });
  localStorage.setItem("panier", JSON.stringify(panier));
  alert(`${nom} ajouté au panier !`);
}

// Afficher le panier
if (document.getElementById("panier-liste")) {
  let liste = document.getElementById("panier-liste");
  let total = 0;

  panier.forEach((item, index) => {
    let div = document.createElement("div");
    div.innerHTML = `${item.nom} - ${item.prix} € <button onclick="supprimerDuPanier(${index})">❌</button>`;
    liste.appendChild(div);
    total += item.prix;
  });

  document.getElementById("total").innerText = "Total : " + total + " €";
}

// Supprimer un élément
function supprimerDuPanier(index) {
  panier.splice(index, 1);
  localStorage.setItem("panier", JSON.stringify(panier));
  location.reload();
}

// Vider panier
function viderPanier() {
  localStorage.removeItem("panier");
  location.reload();
}
