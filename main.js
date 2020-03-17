
var active =  false;
var pointdrag = false;

//arraylar
let nodes = []; 
let paths = [];
let points = []; 


document.addEventListener("mouseup", moveEnd, false);
document.addEventListener("mousemove", move, false);
document.addEventListener("mousedown", moveStart, false);

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
    delBtn.setAttribute("id","del"+_id.slice(4,7));
    newNodeHeader.appendChild(delBtn);

    //Output point instance
    //empty indise yada yeni indise point ekle
    for (let i = 0; i <= points.length; i++) 
    {
        if (points[i] == undefined || points[i]._id == "empty") 
        {
            points[i] = new Point("point" + i, "output", _id);
            console.log(i+ ". indise yeni output point obje koyuldu");

            //Output point element
            let opoint = document.createElement("div");
            opoint.setAttribute("class","connection output");
            opoint.setAttribute("id","point" + i );
            newNode.appendChild(opoint);
            break;
        }

    }

    //Input point instance
    for (let i = 0; i <= points.length; i++) 
    {
        if ( points[i] == undefined || points[i]._id == "empty") 
        {
            points[i] = new Point("point" + i, "input", _id);
            console.log(i+ ". indise yeni input point obje koyuldu");

            //Output point element
            let opoint = document.createElement("div");
            opoint.setAttribute("class","connection input");
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



//-----------------------------------------------------
//Export script
function output()
{
    //Get exporting media
    let output_area = document.getElementById("result"); 
    
    //Clear exporting media
    output_area.innerHTML = "";

    

    //Nodes
    output_area.innerHTML += "//Nodelar \n";
    for (let i = 0; i < nodes.length; i++) 
    {
        if (nodes[i]._id != "empty")
        {
            output_area.innerHTML += "// \n";
            output_area.innerHTML += nodes[i]._id;
            output_area.innerHTML += "\n";
        }
    }

    
    //Points
    output_area.innerHTML += "//Pointler \n";
    for (let i = 0; i < points.length; i++) 
    {
        if (points[i]._id != "empty")
        {
            output_area.innerHTML += "// \n";
            output_area.innerHTML += points[i]._id +"\n";
            output_area.innerHTML += points[i].parent_node_id +"\n";
            output_area.innerHTML += points[i].type+"\n";
        }
    }

    //Paths
    output_area.innerHTML += "//Pathlar \n";
    for (let i = 0; i < paths.length; i++) 
    {
        if (paths[i]._id != "empty")
        {
            output_area.innerHTML += "// \n";
            output_area.innerHTML += paths[i]._id + "\n";
            output_area.innerHTML += paths[i].parent_point_id + "\n";
            output_area.innerHTML += paths[i].target_point_id + "\n";
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
        }
    }

    delNode.remove();
    
    
}

//-----------------------------------------------------
//Path Snap to Input
function snap_to_input(self_id) 
{
    
    //Path'ın çıktığı output self_id oluyor

    let range = 40;

    //Aynı node'un kendisine bağlanmaması için parenti bul
    for (let i = 0; i < points.length; i++) 
    {
        if (points[i]._id==self_id)
        {
            console.log(points[i].parent_node_id);
            point_parent_cache = points[i].parent_node_id;
            console.log("Parent'e snaplenmez");
        }
        
    }

    for (let k = 0; k < points.length; k++) 
    {
        if (points[k].type == "input" && points[k].parent_node_id != point_parent_cache  )
        {
            let pos_of_input = document.getElementById(points[k]._id).getBoundingClientRect();
            console.log(pos_of_input);
            if ( Math.abs(pos_of_input.left-endx)<range && Math.abs(pos_of_input.top-endy)<range  )
            {
                console.log("Yaklaştı");
                console.log(points);
                endx = pos_of_input.left+7;
                endy = pos_of_input.top+7;

                for (let m = 0; m < paths.length; m++) 
                {
                    if ( paths[m]._id == newPath.getAttribute("id") )
                    {
                        //Snap on
                        paths[m].target_point_id = points[k]._id;
                        console.log("snap on");
                       
                    }
                    
                }
                break;
            }
            else
            {
                for (let m = 0; m < paths.length; m++) 
                {
                    if ( paths[m]._id == newPath.getAttribute("id") )
                    {
                        //Snap off
                        paths[m].target_point_id = undefined;
                        break;
                    }
                    
                }
            }
        }
        
    }
    
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

        //Path varmı bak, varsa yeni path ekle yoksa path ekle
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
                        path_to_del = document.getElementById(paths[j]._id);
                        path_to_del.remove();
                        paths[j] = new Path("empty", "empty", "empty"); //verileri sil
                        
                        
                        //pointdrag = false;
                        console.log("Zaten bir path var eskisi silindi");
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
                    newPath.setAttribute("d", "M"+e.x+","+e.y+ " C"+e.x+","+e.y+","+e.x+","+e.y+ " " +e.x+","+e.y );
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
            //Bu node'un  outputu bul
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
            //Bu node'un inputu bul
            else if ( points[i].type == "input" && points[i].parent_node_id == node_id)
            {
                 
                point_cache =  points[i]._id;

                //Bulunan pointe bağlı pathları bul
                for (let j = 0; j < paths.length; j++) 
                {   
                    if ( paths[j].target_point_id == point_cache )
                    {
                        let update_path = document.getElementById(paths[j]._id);
                        let all_points = update_path.getAttribute("d").split(" ");

                        let rect = document.getElementById(point_cache).getBoundingClientRect();
                        let endx = rect.left+7;
                        let endy = rect.top+7;
                        let startx = Number(all_points[0].slice(1,99).split(",")[0]);
                        let starty = Number(all_points[0].slice(1,99).split(",")[1]);
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

        //End pozisyon i mouse konumu yap
        endx = e.x;
        endy = e.y;

        let curvex = Math.abs( (endx-startx)/2 );
        if (curvex<50)
            { curvex = 50; }
            


        //-------------------------------
        //Snap to Input
        snap_to_input(parent_cache);
        

        let coords = "M" +startx + "," + starty 
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