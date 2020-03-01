
var active =  false;
var pointdrag = false;
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
    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("width","800px");
    svg.setAttribute("height","600px");
    svg.style.position = "absolute";
    svg.style.top=0;
    svg.style.left=0;
    svg.style.zIndex=-1;
    document.getElementById("container").appendChild(svg);
    
    
    var newPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    /*
    var ax = a.getBoundingClientRect().left;
    var ay = a.getBoundingClientRect().top;
    var bx = b.getBoundingClientRect().left;
    var by = b.getBoundingClientRect().top;

    var coords = "M" + ax + "," + ay + " " + bx + "," + by;
    */
    var coords = "M200,300 2,21";
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

    //Output point
    var opoint = document.createElement("div");
    //var opointId = "";
    opoint.setAttribute("class","connection output");
    opoint.setAttribute("id","output"+nodeCount+","+0);
    newNode.appendChild(opoint);

    

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
//Mouse down event
function moveStart(e)
{
    //Node hareket ettir
    if (e.target.classList.contains("nodeheader")) //(sadece headera tıklandıysa hareket ettir)
    {
        node=e.target.parentNode ;//Hangi iteme tıklandı id değiş 
        active = true;//Sürükleme switchi aç
    }

    //Path hareket ettir
    if (e.target.classList.contains("output"))
    {
        point = e.target; //Hangi outputa tıklandı
        pointdrag = true;

        newPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        svg.appendChild(newPath);
        newPath.setAttribute("fill","none");
        newPath.setAttribute("stroke","black");
        newPath.setAttribute("stroke-width","3");
    }


}

function move(e)
{
    //Node sürükle
    if (active)
    {
        node.style.left = e.x - (node.offsetWidth/2) + "px";
        node.style.top = e.y - 16 + "px"; 
    }

    //Point bağla (path oluştur)
    if (pointdrag)
    {
        var rect = point.getBoundingClientRect();
        var l = rect.left+7;
        var t = rect.top+7;
        var coords = "M"+l+","+ t +" "+ e.x + ","+ e.y;
        newPath.setAttribute("d",coords);
    }

    
}

function moveEnd()
{
    active = false;
    pointdrag = false;
    point = 0;
    node = 0;
}