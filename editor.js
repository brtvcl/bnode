//Cutscene editor js

document.getElementById("addNode").addEventListener("click",addIndexBox);

let indexes = [];
let indexCount=0;

function Index(_id, parent_node_id, i)
{
    this._id = _id;
    this.parent_node_id = parent_node_id;
    this.i = i;

    let newIndexBox = document.createElement("input");
    newIndexBox.setAttribute("type","number");
    newIndexBox.setAttribute("id",i);
    document.getElementById(parent_node_id).appendChild(newIndexBox);    

}

function removeIndexBox(k)
{
    console.log( k );
    console.log( indexes );
    indexes[k]._id = "empty";
    indexes[k].parent_node_id = "empty";
    indexes[k].i = "empty";
}

function addIndexBox()
{
    console.log(indexes);
    console.log("Yeni i inputu ekleniyor..");

    for (let i = 0; i <= nodes.length; i++) 
    {
        if (nodes[i]!=undefined && nodes[i]._id != "empty")
        {
            console.log(nodes[i]._id+" node una bağlı inputlar kontrol ediliyor....");

            for (let j = 0; j <= indexes.length; j++) 
            {
                
                if ( (indexes[j] != undefined && indexes[j]._id != "empty" ) && indexes[j].parent_node_id == nodes[i]._id)
                {
                    console.log(nodes[i]._id +" "+ indexes[j]._id+" ile bağlı");
                    break;
                }
                else if ( j==indexes.length )
                {
                    console.log(nodes[i]._id + " için i input yok, oluşturuluyor");
                    console.log(nodes[i]._id+ " artık index"+indexCount+ " input'un parenti");
                    indexes[indexCount] = new Index("index"+indexCount, nodes[i]._id, 0);

                    delid = nodes[i]._id.slice(4,8);
                    delelement = document.getElementById("del"+delid)
                    console.log(delelement);
                    currentdelevent = delelement.getAttribute("onclick");
                    delelement.setAttribute("onclick",currentdelevent+";removeIndexBox("+indexCount+")");

                    /*
                    document.getElementById("del"+delid).addEventListener("click", function() {
                        removeIndexBox(indexCount); 
                    });
                    */
                    indexCount++;

                    console.log(indexes);
                    break;
                }
                
            }
        }
        
    }
    
}

