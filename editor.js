//Cutscene editor js

document.getElementById("addNode").addEventListener("click",addDefaultInput);

let indexes =  [];
let performs = [];
let args = [];
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
    
    args[0] = new Arg(_id, this._id, parent_node_id, 0, "obj_player");


}

function Arg(_id,parent_perform_id,parent_node_id,arg_number,value)
{
    this._id = "argument"+_id;
    this.parent_perform_id = parent_perform_id;
    this.arg_number = arg_number;
    this.value = value;

    //DOM Element Create
    let new_arg_input = document.createElement("input");
    new_arg_input.setAttribute("type","text");
    new_arg_input.setAttribute("id",this._id);
    new_arg_input.setAttribute("value",this.value);

    //Add event listener to update value in array
    new_arg_input.addEventListener("change",function(){
        args[_id].value = new_arg_input.value; 
        console.log("value in args["+_id+"] updated as '"+args[_id].value+"'");
        console.log(args);
       });

    //Append to parent node
    document.getElementById(parent_node_id).appendChild(new_arg_input);

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
    console.log( speaks );
    console.log( performs );  
    
    indexes[i]._id            = "empty";
    indexes[i].parent_node_id = "empty";
    indexes[i].value          = "empty";
    
    speaks[i]._id             = "empty";
    speaks[i].parent_node_id  = "empty";
    speaks[i].value           = "empty";   
    
    performs[i]._id           = "empty";
    performs[i].parent_node_id= "empty";
    performs[i].value         = "empty";
    

}

//Perform Script add button
//Adds a button element
//When clicked the added button, it creates the perform input and creates "delete button" of perform input
function add_perform_button(parent_node_index, perform_index)
{
    let perform_add_btn = document.createElement("button");
    let id_name = "perform_add_btn";
    perform_add_btn.setAttribute("id",id_name+perform_index);
    perform_add_btn.innerHTML = "+";
    perform_add_btn.addEventListener("click", addPerformInput.bind(null, parent_node_index, perform_index));
    document.getElementById(nodes[parent_node_index]._id).appendChild(perform_add_btn);

}

//Deletes the perform input element and delets data in the performs[] array 
function del_perform_input(parent_node_index, perform_index)
{
    document.getElementById("prf_del_btn"+perform_index).remove();
    document.getElementById("perform"+perform_index).remove();

    performs[perform_index]._id = "empty";
    performs[perform_index].parent_node_id = "empty";
    performs[perform_index].value = "empty";

    add_perform_button(parent_node_index,perform_index);
}

//Function of the "add perform script" button
//Adds the new perform input
//Removes the button
function addPerformInput(parent_node_index, perform_index)
{
    let parent_node_id = nodes[parent_node_index]._id;

    performs[perform_index] = new Perform(perform_index, parent_node_id, 0);

    //Perform Script del button
    let prf_del_btn = document.createElement("button");
    prf_del_btn.setAttribute("id","prf_del_btn"+perform_index);
    prf_del_btn.innerHTML = "X";
    prf_del_btn.addEventListener("click", del_perform_input.bind(null, parent_node_index, perform_index));
    document.getElementById(parent_node_id).appendChild(prf_del_btn);

    //Ekle butonunu sil
    document.getElementById("perform_add_btn"+perform_index).remove();

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

                            add_perform_button(k,i);
                            
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

