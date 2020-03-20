//Cutscene editor js

document.getElementById("addNode").addEventListener("click",addIndexBox);

let indexes =  [];
let performs = [];

//---------------------------------------
//INDEX INPUT START
//--------------------------------------

//Perform input object
function Perform(_id, parent_node_id, value)
{
    this._id = _id;
    this.parent_node_id = parent_node_id;
    this.value = value;
    
    let newPerformInput = document.createElement("select");
    newPerformInput.setAttribute("id",_id);

    document.getElementById(parent_node_id).appendChild(newPerformInput); 

    let newPerformOption = document.createElement("option");
    newPerformOption.setAttribute("value","perform1");
    newPerformOption.innerHTML = "perform1";
    newPerformInput.appendChild(newPerformOption); 

    newPerformOption = document.createElement("option");
    newPerformOption.setAttribute("value","perform1");
    newPerformOption.innerHTML = "perform2";
    newPerformInput.appendChild(newPerformOption); 


}

//--------------------------------------
//Index input object
function Index(_id, parent_node_id, value)
{
    this._id = _id;
    this.parent_node_id = parent_node_id;
    this.value = value;

    let newIndexBox = document.createElement("input");
    newIndexBox.setAttribute("type","number");
    newIndexBox.setAttribute("id",_id);
    newIndexBox.setAttribute("value",value);
    document.getElementById(parent_node_id).appendChild(newIndexBox);    

}

function removeIndexBox(k)
{
    console.log("deleted : indexes["+ k+"]" );
    console.log( indexes );
    indexes[k]._id = "empty";
    indexes[k].parent_node_id = "empty";
    indexes[k].value = "empty";
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
                    
                    for (let k = 0; k <= indexes.length; k++) 
                    {
                        if (indexes[k]==undefined || indexes[k]._id == "empty")
                        {
                            console.log("indexes["+k+"] yeni input eklendi");

                            //Yeni index input ekle 
                            indexes[k] = new Index("index"+k, nodes[i]._id, k);
                            performs[0] = new Perform("perform0",nodes[i]._id, 0);
                            
                            //------------------------------------------------
                            //Yeni indexi array'dan silmek için event listener ekle
                            
                            //Silme butonunu bul
                            delid = nodes[i]._id.slice(4,8);
                            delelement = document.getElementById("del"+delid);

                            //Event listener ekle
                            document.getElementById("del"+delid).addEventListener("click", removeIndexBox.bind(null,k) );

                            break;
                        }
                    }

                    //TERMINATE ALL THE LOOPS!!
                    i=nodes.length+1;
                    
                    console.log(indexes);
                    break;
                }
                
            }
        }
        
    }
    
}

//---------------------------------------
//INDEX INPUT END
//---------------------------------------

