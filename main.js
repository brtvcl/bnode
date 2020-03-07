
var active =  false;
var pointdrag = false;


pathCount = 0;  

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
    delBtn.setAttribute("class","delBtn");
    newNodeHeader.appendChild(delBtn);

    //Output point instance
    //empty indise yada yeni indise point ekle
    for (let i = 0; i <= points.length; i++) 
    {
        if (points[i] == undefined || points[i]._id == "empty") 
        {
            points[i] = new Point("point" + i, "output", _id);
            console.log(i+ ". indise yeni point obje koyuldu");

            //Output point element
            let opoint = document.createElement("div");
            opoint.setAttribute("class","connection output");
            opoint.setAttribute("id","point" + i );
            newNode.appendChild(opoint);
            break;
        }
    }

}

//Path objesi tanımla
function Path(_id, parent_point_id, target_point_id)
{
    this._id = _id;
    this.parent_point_id = parent_point_id;
    this.target_point_id = target_point_id;
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
    //empty indise yada yeni indise node ekle
    for (let i = 0; i <= nodes.length; i++) 
    {
        if (nodes[i] == undefined || nodes[i]._id == "empty") 
        {
            nodes[i] = new Node("node" + i);
            console.log(i+ ". indise yeni node obje koyuldu");
            break;
        }
    }

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
            nodes[i]._id = "empty";
            break;
        }
        
    }


    //Parenti silinecek node olan pointleri bul ve pathlarını, verilerini sil
    for (let i = 0; i < points.length; i++) 
    { 
        //Bu nodeun pointi bul
        if (points[i].parent_node_id == del)
        {
            //Point'e ait pathları sil
            //var all_paths = document.getElementsByClassName(delNode.getAttribute("id"));
            for(let j = 0; j < paths.length; j++)
            {
                if (paths[j].parent_point_id == points[i]._id)
                {
                    path_to_del = document.getElementById(paths[j]._id);
                    path_to_del.remove();
                    paths[j] = new Path("empty", "empty", "empty"); //verileri sil
                }
            }

            points[i] = new Point("empty", "empty", "empty");
            break;
        }
    }

    delNode.remove();
    
    
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

        node=e.target.parentNode ;//Hangi iteme tıklandı id al
        node_id = node.getAttribute("id");
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
                //Pointin id cachele
                parent_cache =  points[i]._id;
                
                for (let j = 0; j < paths.length; j++) 
                {
                    //Pointin parentine ait path varmı kontrol et
                    if (paths[j].parent_point_id == parent_cache)
                    {
                        //Path eklemeyi kapat
                        //? ilerde eski pathı silip yeni path ekle 
                        pointdrag = false;
                        console.log("Zaten bir path var");
                    }
                }
            }
        }
        

        //Path ekle
        if (pointdrag)
        {
            for (let i = 0; i <= paths.length; i++) 
            {
                if (paths[i] == undefined || paths[i]._id == "empty") 
                {
                    paths[i] = new Path("path"+ i, parent_cache, undefined);
                    console.log(i+ ". indise yeni path obje koyuldu");

                    //Output path element
                    newPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    newPath.setAttribute("id","path" + i);
                    svg.appendChild(newPath);
                    newPath.setAttribute("fill","none");
                    newPath.setAttribute("stroke","black");
                    newPath.setAttribute("stroke-width","3");
                    break;
                }
            }
            
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

        
        console.log(paths);
        console.log(points);
        console.log(nodes);

        //Pathları güncelle
        //Bu nodeun pointlerini bul
        for (let i = 0; i < points.length; i++) 
        {
            if ( points[i].type == "output" && points[i].parent_node_id == node_id )   
            {
                point_cache =  points[i]._id;

                //Bulunan pointe bağlı pathları bul
                for(let j=0; j<paths.length; j++)
                {
                    //Bulunan pathı güncelle
                    if ( paths[j].parent_point_id == point_cache )
                    {
                        let update_path = document.getElementById(paths[j]._id);
                        let all_points = update_path.getAttribute("d").split(" ");

                        let rect = document.getElementById(point_cache).getBoundingClientRect();
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

                        update_path.setAttribute("d",coords);

                    }
                }
            }
        }
    }



    //Point bağla (path oluştur)
    if (pointdrag)
    {
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