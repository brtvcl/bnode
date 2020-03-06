
var active =  false;
var pointdrag = false;

//sayaçlar
nodeCount = 0; 
pathCount = 0;  
pointCount = 0;

//arraylar
let nodes = []; 
let paths = [];
let points = []; 

document.addEventListener("mouseup", moveEnd, false);
document.addEventListener("mousemove", move, false);
document.addEventListener("mousedown", moveStart, false);

//Node objesi tanımla
function Node(_id)
{
    this._id = _id;
    
    //Node oluştur
    let newNode = document.createElement("div");
    newNode.setAttribute("id",this._id);
    newNode.setAttribute("class","node");
    document.getElementById("container").appendChild(newNode);

    //Node header
    var newNodeHeader = document.createElement("div");
    newNodeHeader.setAttribute("class","nodeheader");
    newNode.appendChild(newNodeHeader);

    //Silme butonu
    var delBtn = document.createElement("div");
    var btnId = "nodeSil('"+_id+"')";
    delBtn.setAttribute("onclick",btnId);
    delBtn.setAttribute("class","delBtn")
    newNodeHeader.appendChild(delBtn);

    //Output pointi
    points[pointCount] = new Point("point" + pointCount,"output", _id);

    //Output point
    let opoint = document.createElement("div");
    opoint.setAttribute("class","connection output");
    opoint.setAttribute("id","point" + pointCount );
    newNode.appendChild(opoint);

    //Arttır
    nodeCount++;
    pointCount++;
}

//Path objesi tanımla
function Path(_id, parent_node_id, target_node_id)
{
    this._id = _id;
    this.parent_node_id = parent_node_id;
    this.target_node_id = target_node_id;
}

//Point objesi tanımla
function Point(_id, type, parent_node_id)
{
    this._id = _id;
    this.type = type;
    this.parent_node_id = parent_node_id;
}



//--------------------------------------------------
//SVG Oluştur
{

    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("width","1280px");
    svg.setAttribute("height","620px");
    svg.style.position = "absolute";
    svg.style.top=0;
    svg.style.left=0;
    svg.style.zIndex=-1;
    document.getElementById("container").appendChild(svg);   
}

//---------------------------------------------------
//Node ekle
function nodeEkle()
{
    //nodeCount id'si ile node objesi oluştur
    nodes[nodeCount] = new Node("node" + nodeCount); 
}


//------------------------------------------------------
//Node sil
function nodeSil(del)
{
    var delNode = document.getElementById(del);

    //Silinecek node'un verilerini sil
    for (let i = 0; i < nodes.length; i++) 
    {
        if (nodes[i]._id == del)
        {
            nodes[i] = undefined;
            break;
        }
        
    }

    //Parenti silinecek node olan pointleri bul ve verilerini sil
    for (let i = 0; i < points.length; i++) 
    {
        if (points[i].parent_node_id == del)
        {
            points[i] = undefined;
            pointCount--;
        }
    }

    var all_paths = document.getElementsByClassName(delNode.getAttribute("id"));

    while(all_paths[0]) 
    {
        all_paths[0].remove();
        pathCount-=1;
    }
    delNode.remove();
    
    nodeCount--;
    
}


//------------------------------------------------------
//Mouse down event
function moveStart(e)
{
    //Node sürükle
    if (e.target.classList.contains("nodeheader")) //(sadece headera tıklandıysa hareket ettir)
    {
        //Tarayıcının sürüklemeyi engelle
        e = e || window.event;
        e.preventDefault();

        node=e.target.parentNode ;//Hangi iteme tıklandı id değiş 
        active = true;//Sürükleme switchi aç
        
    }

    //Point sürükle || Path oluştur
    if (e.target.classList.contains("output"))
    {
        //Tarayıcının sürüklemeyi engelle
        e = e || window.event;
        e.preventDefault();

        point = e.target; //Hangi outputa tıklandı
        pointdrag = true;

        //Path varmı bak
        //---------------------------------
        //Bu pointi bul
        for (let i = 0; i < points.length; i++) 
        {
            if ( points[i].type == "output" && points[i]._id == point.getAttribute("id") )   
            {
                //Pointin parentini bul
                parent_cache =  points[i].parent_node_id;
                
                for (let j = 0; j < paths.length; j++) 
                {
                    //Pointin parentine ait path varmı kontrol et
                    if (paths[j].parent_node_id == parent_cache)
                    {
                        //Path eklemeyi kapat
                        //? ilerde eski pathı silip yeni path ekle 
                        pointdrag = false;
                    }
                }
            }
        }
        

        //Path ekle
        if (pointdrag)
        {
            paths[pathCount] = new Path("path"+ pathCount, parent_cache, undefined);

            newPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            newPath.setAttribute("id","path" + pathCount);
            //newPath.setAttribute("parent_node_id",e.target.parentNode.getAttribute("id"));
            newPath.classList.add(e.target.parentNode.getAttribute("id"));
            svg.appendChild(newPath);
            newPath.setAttribute("fill","none");
            newPath.setAttribute("stroke","black");
            newPath.setAttribute("stroke-width","3");
            pathCount++;
        }
    }


}

function move(e)
{
    //Node sürükle
    if (active)
    {
        node.style.left = e.x - (node.offsetWidth/2) + "px";
        node.style.top = e.y - 16 + "px"; 

        //Pathları sürükle
        var all_paths = document.getElementsByClassName(node.getAttribute("id"));

        //Tüm pathları döngüde güncelle
        for(let i=0; i < all_paths.length ; i++)
        {
            let path_points = all_paths[i].getAttribute("d"); //Nokta koordinatları
            let all_points= path_points.split(" ");    //Başlangıç koordinatı  
            let connections = node.getElementsByClassName("connection"); //Connection obje

            let rect  = connections[0].getBoundingClientRect();
            let startx = rect.left+7;
            let starty = rect.top+7;
            let endx = all_points[2].split(",")[0];
            let endy = all_points[2].split(",")[1];
            let curvex = Math.abs( (endx-startx)/2 );
            if (curvex<50)
            { curvex = 50; }

            let coords = "M" +startx + "," + starty 
            +" C"+ (startx+curvex) + "," + starty
            +","+ (endx-curvex) + "," + endy   
            +" "+ endx + "," + endy;

            all_paths[i].setAttribute("d",coords)
        }
    }

    //Point bağla (path oluştur)
    if (pointdrag)
    {
        /*
        var rect = point.getBoundingClientRect();
        var l = rect.left+7;
        var t = rect.top+7;
        var coords = "M"+l+","+ t +" "+ e.x + ","+ e.y;
        */

        let rect  = point.getBoundingClientRect();
        let startx = rect.left+7;
        let starty = rect.top+7;
        let endx = e.x;
        let endy = e.y;
        let curvex = Math.abs( (endx-startx)/2 );
        if (curvex<50)
            { curvex = 50; }

        coords = "M" +startx + "," + starty 
        +" C"+ (startx+curvex) + "," + starty 
        +","+ (endx-curvex) + "," + endy 
        +" "+ endx + "," + endy;

        console.log(coords);

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