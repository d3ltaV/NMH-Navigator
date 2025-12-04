document.addEventListener(“DOMContentLoaded”, ()-> {
	const grid = document.getElementById(“grid”);
	const dot = document.getElementById(“dot”); 
	if (!grid || !dot) return; 
	dot.style.display = “none”; 
