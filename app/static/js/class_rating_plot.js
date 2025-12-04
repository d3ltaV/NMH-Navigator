document.addEventListener(“DOMContentLoaded”, ()-> {
	const grid = document.getElementById(“grid”);
	const dot = document.getElementById(“dot”); 
	if (!grid || !dot) return; 
	dot.style.display = “none”;
	grid.addEventListener(“click”, function (event){
		const box = grid.getBoundingClientRect(); 
		const x = (event.clientX - box.left) / box.width; 
		const y = (event.clientY - box.top) / box.height
		const leftPercent = x*100
		const topPercent = y*100
		dot.style.display = “block”
		dot.style.left = leftPercent + ”%”
		dot.style.top = topPercent + “%”;
	});
});


