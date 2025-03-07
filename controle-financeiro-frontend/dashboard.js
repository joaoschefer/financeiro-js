function toggleSidebar(){
    let sidebar = document.querySelector(".sidebar");
    let content = document.querySelector(".main-content");

    sidebar.classList.toggle("minimized");
    content.classList.toggle("minimized");
}

document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("modal");
    const abrirModal = document.getElementById("abrir-modal");
    const fecharModal = document.querySelector(".fechar-modal");

    // Modal inicia oculto
    modal.style.display = "none";

    // Abrir o modal ao clicar no botão
    abrirModal.addEventListener("click", function() {
        modal.style.display = "flex";
    });

    // Fechar o modal ao clicar no "X"
    fecharModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Fechar o modal ao clicar fora dele
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

