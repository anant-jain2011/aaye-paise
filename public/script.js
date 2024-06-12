const colors = ["#ff671f", "#06038d", "#158809"];

document.onload = async () => {
    const res = await fetch("/getblocks");
    const data = await res.json();

    data.forEach((mBlock) => {
        const block = document.createElement("div");
        block.style.backgroundColor = colors[Math.floor(Math.random() * 3 + 1)];
        block.innerText = mBlock.amount;
        block.classList.add("block");

        document.body.appendChild(block);
    })
}

if (!window.eventSource) {
    window.eventSource = new EventSource("/events");

    window.eventSource.addEventListener("message", (e) => {
        const block = document.createElement("div");
        block.style.backgroundColor = colors[Math.floor(Math.random() * 3)];
        block.innerText = e.data;
        block.classList.add("block");

        document.body.appendChild(block);
    });
}