//Cutscene editor js

document.getElementById("addNode").addEventListener("click",addDefaultInput);

let indexes =  [];
let performs = [];
let speaks = [];

//---------------------------------------
//INDEX INPUT START
//--------------------------------------

//Speak input object
function Speak(_id, parent_node_id, value)
{
    //Constructors
    this._id = "speak"+_id;
    this.parent_node_id = parent_node_id;
    this.value = value;

    //DOM Element create
    let newSpeakInput = document.createElement("input");
    newSpeakInput.setAttribute("type","text");
    newSpeakInput.setAttribute("id",this._id);

    //addEventListener so When input entered update value 
    newSpeakInput.addEventListener("change",function(){
         speaks[_id].value = newSpeakInput.value; 
         console.log("value in speaks["+_id+"] updated as '"+speaks[_id].value+"'");
         console.log(speaks);
        });

    //Append to parent node
    document.getElementById(parent_node_id).appendChild(newSpeakInput);
}

//Perform input object
function Perform(_id, parent_node_id, value)
{
    this._id = "perform"+_id;
    this.parent_node_id = parent_node_id;
    this.value = value;
    
    let newPerformInput = document.createElement("select");
    newPerformInput.setAttribute("id",this._id);

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
    //Constructors
    this._id = "index"+_id;
    this.parent_node_id = parent_node_id;
    this.value = value;

    //DOM Element
    let newIndexInput = document.createElement("input");
    newIndexInput.setAttribute("type","number");
    newIndexInput.setAttribute("id",this._id);
    newIndexInput.setAttribute("value",value);

    //addEventListener so When input entered update value 
    newIndexInput.addEventListener("change",function(){
    indexes[_id].value = newIndexInput.value; 
    console.log("value in indexes["+_id+"] updated as '"+indexes[_id].value+"'");
    console.log(indexes);
    });
    
    //Appent to node
    document.getElementById(parent_node_id).appendChild(newIndexInput);    

}

//Removing the default inputs
//!!!!Add removal of event listener in future
function removeDefaultInput(i)
{
    console.log("deleted : indexes["+ i+"]" );
    console.log( indexes );
    
    indexes[i]._id            = "empty";
    indexes[i].parent_node_id = "empty";
    indexes[i].value          = "empty";
    
    speaks[i]._id             = "empty";
    speaks[i].parent_node_id  = "empty";
    speaks[i].value           = "empty";       

}

//Function of the "add perform script" button
//Adds the new perform input
//Removes the button
function addPerformInput(k, parent_node_id, value, button_id)
{
    performs[k] = new Perform(k, parent_node_id, value);

    document.getElementById(button_id).remove();
}

//Adding the default inputs and appending it to node
function addDefaultInput()
{
    /*This function searches all the 
    nodes and finds the new added one to the workspace
    And adds the default inputs to the node*/

    console.log(indexes);
    console.log("Yeni i inputu ekleniyor..");

    //Search in all nodes
    for (let i = 0; i <= nodes.length; i++) 
    {
        //Skip the undefined or "empty" (deleted) nodes
        if (nodes[i]!=undefined && nodes[i]._id != "empty")
        {
            console.log("Checking if this "+nodes[i]._id+" has any inputs");
            //Search in all index inputs
            for (let j = 0; j <= indexes.length; j++) 
            {
                /*Check if index input is available (not "empty" or undefined), 
                and check if this input's parent is the node that we are searching for
                IF YES that means that means this node isn't the one we are looking for
                (we are looking for a node that has no input so we can add the input)
                IF NOT and also if we checked all the indexes this means 
                we found the node that has no index input 
                */

                //Checking if this indexes parent is the node we are in
                if ( (indexes[j] != undefined && indexes[j]._id != "empty" ) && indexes[j].parent_node_id == nodes[i]._id)
                {
                    console.log(nodes[i]._id +" and "+ indexes[j]._id+" is connected");
                    break;
                }
                //IF NOT, check if we checked all the index inputs
                else if ( j==indexes.length )
                {
                    /*Search in all indexes, so we can 
                    insert the new one if theres an "empty" one
                    other just add new one
                    */
                    for (let k = 0; k <= indexes.length; k++) 
                    {
                        //If found "empty" or undefined(new slot) add the inputs there
                        if (indexes[k]==undefined || indexes[k]._id == "empty")
                        {
                            //Create default inputs
                            indexes[k] = new Index(k, nodes[i]._id, k);
                            speaks[k] = new Speak(k,nodes[i]._id, "");


                            //Perform Script add button
                            let prfbtn = document.createElement("button");
                            prfbtn.setAttribute("id","prfbtn"+k);
                            prfbtn.innerHTML = "+";
                            prfbtn.addEventListener("click", addPerformInput.bind(null, k, nodes[i]._id, 0, "prfbtn"+k));
                            document.getElementById(nodes[i]._id).appendChild(prfbtn);
                            

                            //------------------------------------------------
                            //Silme butonunu bul
                            delid = nodes[i]._id.slice(4,8);
                            delelement = document.getElementById("del"+delid);
                            //Veriyi silmek için delete butonuna Event listener ekle
                            document.getElementById("del"+delid).addEventListener("click", removeDefaultInput.bind(null,k) );

                            break;
                        }
                    }

                    //TERMINATE ALL THE LOOPS!!
                    /*This sets the variable 
                    of the first loop to out of range
                    so all the loops STOPS  */
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

