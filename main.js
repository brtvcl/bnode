
var active =  false;
nodeCount = 0;  



document.addEventListener("mouseup", moveEnd, false);
document.addEventListener("mousemove", move, false);
document.addEventListener("mousedown", moveStart, false);


//--------------------------------------------------
//Path Çiz
//function pathAdd()

{
    var a = document.getElementById("a");
    var b = document.getElementById("b");
    var svg = document.createElement("svg");
    svg.setAttribute("width","400px");
    svg.setAttribute("height","400px");
    document.getElementById("container").appendChild(svg);

    var newPath = document.createElement("path");
    var ax = a.getBoundingClientRect().left;
    var ay = a.getBoundingClientRect().top;
    var bx = b.getBoundingClientRect().left;
    var by = b.getBoundingClientRect().top;

    var coords = "M" + ax + "," + ay + " " + bx + "," + by;
    newPath.setAttribute("d",coords);
    newPath.setAttribute("fill","none");
    newPath.setAttribute("stroke","black");
    newPath.setAttribute("stroke-width","3");
    svg.appendChild(newPath);
}


//---------------------------------------------------
//Node ekle
function nodeEkle()
{
    //Node
    var newNode = document.createElement("div");
    newNode.setAttribute("id","node" + nodeCount);
    newNode.setAttribute("class","node");
    document.getElementById("container").appendChild(newNode);

    //Header
    var newNodeHeader = document.createElement("div");
    newNodeHeader.setAttribute("class","nodeheader");
    document.getElementById("node"+nodeCount).appendChild(newNodeHeader);

    //Silme butonu
    var delBtn = document.createElement("div");
    var btnId = "nodeSil(" + "'node" + nodeCount + "')";
    delBtn.setAttribute("onclick",btnId);
    delBtn.setAttribute("class","delBtn")
    newNodeHeader.appendChild(delBtn);
    

    nodeCount++;
}


//------------------------------------------------------
//Node sil
function nodeSil(del)
{
    //var delId = "node"+(nodeCount-1).toString();
    nodeCount--;
    var delNode = document.getElementById(del);
    delNode.remove();
    
}


//------------------------------------------------------
//Node sürükle
function moveStart(e)
{
    if (e.target.classList.contains("nodeheader")) //(sadece headera tıklandıysa hareket ettir)
    {
            node=e.target.parentNode ;//Hangi iteme tıklandı id değiş 
            active = true;//Sürükleme switchi aç
    }


}

function move(e)
{
    if (active)
    {
        node.style.left = e.x - (node.offsetWidth/2) + "px";
        node.style.top = e.y - 16 + "px"; 
    }
    
}

function moveEnd()
{
    active = false;
    node = 0;
}