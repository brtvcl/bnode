//Cutscene editor js

document.getElementById("addNode").addEventListener("click",addDefaultInput);
//commit
let indexes  = [];
let performs = [];
let args     = [];
let speaks   = [];
let answers  = [];
let script_data= [];

function Script_data(name, description, args)
{
    this.name = name;
    this.description = description;
    this.args = args;
}

//Script dropdown listesine JSON verilerini ekle
function populate_script_list(element_id)
{
    let dropdown = document.getElementById(element_id);
    dropdown.length = 0;

    let default_option = document.createElement('option');
    default_option.text = 'Script';

    dropdown.add(default_option);
    dropdown.selectedIndex = 0;

    const url = 'perform_scripts.json';

    fetch(url)  
    .then(  
      function(response) {  
        if (response.status !== 200) {  
          console.warn('Looks like there was a problem. Status Code: ' + 
            response.status);  
          return;  
        }
  
        //Response text'i muayene et  
        response.json().then(function(json_data) 
        {  
          let option;
        
            for (let i = 0; i < json_data.length; i++) 
            {
                option = document.createElement('option');
                option.text = json_data[i].name;
                option.value = i;
                script_data[i] = new Script_data(json_data[i].name, json_data[i].description, json_data[i].args);
                dropdown.add(option);
               
            }  
        });  
      }  
    )  


}
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

    //Append to answer & main node
    document.getElementById(parent_node_id).getElementsByClassName("item mid")[0].appendChild(newSpeakInput);
}

//Perform input object
function Perform(_id, parent_node_id, value)
{
    this._id = "perform"+_id;
    this.parent_node_id = parent_node_id;
    this.value = value;
    
    let newPerformInput = document.createElement("select");
    newPerformInput.setAttribute("id",this._id);

    //When value updated change argument inputs accordingly and write value in array
    newPerformInput.addEventListener("change",function()
    {
        //Write element value in array;
        performs[_id].value = newPerformInput.value;

        //Seçilen scriptin script_data içindeki indexi selected' içinde tut
        let selected = newPerformInput.options[newPerformInput.selectedIndex].value;
        
        //Tüm arguman elementleri içinden bu scripte ait olanları bul
        //Ve arguman sayısına göre bunları 'görünmez' yap (display:none)
        //5 arguman inputu içinde bunu tekrarla
        for (let i = 0; i < 5; i++) {
            args.forEach(element => {
                if (_id == element.parent_perform_index)
                {
                    if (element.arg_number >= script_data[selected].args.length)
                    {
                        //arguman sayısı uyuşmuyorsa bu inputu gizle
                        document.getElementById(element._id).style.display = "none";
                    }
                    else
                    {
                        // arguman sayısı uyuyorsa bu inputları tipine göre değiştir
                        let el = document.getElementById(element._id); 
                        el.style.display = "block";
                        el.value = script_data[selected].args[element.arg_number];
                        switch (script_data[selected].args[element.arg_number]) 
                        {
                            case "real": el.type = "number"; break;
                            case "string" : el.type = "text"; break; 
                            default: el.type = "text"; break;
                        }                    
                    }
                }
            });
        }
    });


    //Perform Script dropdown append 
    document.getElementById(parent_node_id).getElementsByClassName("item mid")[0].appendChild(newPerformInput); 
    
    populate_script_list(this._id);

    for (let repeat = 0; repeat < 5; repeat++) 
    {
        for (let i = 0; i <= args.length; i++) 
        {
            if (args[i]==undefined || args[i]._id == "empty")
            {
                args[i] = new Arg(i, _id, parent_node_id, repeat, "");
                break;
            }
        }    
    }  
    
    console.log(args);


}

function Arg(_id,parent_perform_index,parent_node_id,arg_number,value)
{
    this._id = "argument"+_id;
    this.parent_perform_index = parent_perform_index;
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
    document.getElementById(parent_node_id).getElementsByClassName("item mid")[0].appendChild(new_arg_input);

}
//--------------------------------------
//Index input object
function Index(_id, parent_node_id, value)
{
    //Constructors
    this._id = "index"+_id;
    this.parent_node_id = parent_node_id;
    this.value = String(value);

    //DOM Element
    let newIndexInput = document.createElement("input");
    newIndexInput.setAttribute("type","number");
    newIndexInput.setAttribute("id",this._id);
    newIndexInput.setAttribute("class","index");
    newIndexInput.setAttribute("value",value);

    //addEventListener so When input entered update value 
    newIndexInput.addEventListener("change",function(){
    indexes[_id].value = newIndexInput.value; 
    console.log("value in indexes["+_id+"] updated as '"+indexes[_id].value+"'");
    console.log(indexes);
    });
    
    //Appent to node's mid grid item
    document.getElementById(parent_node_id).getElementsByClassName("nodeheader")[0].appendChild(newIndexInput);    

}

function Answer(_id,parent_node_id)
{
    ///Constructors
    this._id = "answer"+_id;
    this.parent_node_id = parent_node_id;

    //DOM Answer Grid Element create
    let newAnswerInput = document.createElement("div");
    newAnswerInput.setAttribute("class","grid answer");
    newAnswerInput.setAttribute("id",this._id);

    //Item mid
    let newItemMid = document.createElement("div");
    newItemMid.setAttribute("class","item mid");
    newAnswerInput.appendChild(newItemMid);

    //Item right (answer output)
    let newItemRight = document.createElement("div");
    newItemRight.setAttribute("class","item right");
    newAnswerInput.appendChild(newItemRight);

    //Appent to parent node
    document.getElementById(parent_node_id).appendChild(newAnswerInput);

    //Text
    /*
    let count = 0;
    for (let i = 0; i < answers.length; i++) 
    {
        if (answers[i].parent_node_id == parent_node_id)
        {count++;}
        
    }
    */

    for (let i = 0; i <= speaks.length; i++) 
    {
        if (speaks[i]==undefined || speaks[i]._id=="empty")
        {
            speaks[i] = new Speak(i, this._id, "");
            break;
        }   
    }
    

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
    
    /*
    performs[i]._id           = "empty";
    performs[i].parent_node_id= "empty";
    performs[i].value         = "empty";
    */

}

//Perform Script add button
//Adds a button element
//When clicked the added button, it creates the perform input and creates "delete button" of perform input


//-----------
//PERFORM ELEMENT
{
    function add_perform_button(parent_id)
    {
        //Create button
        let perform_add_btn = document.createElement("button");
        perform_add_btn.innerHTML = "+";
        
        //Set unique id for button
        let id_name = "perform_add_btn";
        let btn_index = 0;
        //Check how many buttons present on DOM
        while (!!document.getElementById("perform_add_btn"+btn_index)) {
            btn_index++;
        }
        perform_add_btn.setAttribute("id",id_name+btn_index);
        
        //Append button to DOM
        document.getElementById(parent_id).getElementsByClassName("item mid")[0].appendChild(perform_add_btn);

        //Add EventListener
        perform_add_btn.addEventListener("click", add_perform_input.bind(null, parent_id, id_name+btn_index));
        
    }
    //Function of the "add perform script" button
    //Adds the new perform input
    //Removes the button
    function add_perform_input(parent_id, button_id)
    {
        let perform_index = 0;

        //Add perform to empty array index
        while (perform_index <= performs.length) {
            if ( performs[perform_index]==undefined || performs[perform_index]._id == "empty") 
            {
                performs[perform_index] = new Perform(perform_index,parent_id,0);
                break;
            }
            perform_index++;
        }


        //Perform Script del button
        let prf_del_btn = document.createElement("button");
        prf_del_btn.setAttribute("id","prf_del_btn"+perform_index);
        prf_del_btn.innerHTML = "X";
        prf_del_btn.addEventListener("click", del_perform_input.bind(null, parent_id, perform_index));
        document.getElementById(parent_id).getElementsByClassName("item mid")[0].appendChild(prf_del_btn);

        //Perform script parent node silinince verileri sil
        //Silme butonunu bul
        if (parent_id.includes("node"))
        {
            delid = parent_id.slice(4,8);
            delelement = document.getElementById("del"+delid);
            //silme event listener ekle
            delelement.addEventListener("click",del_perform_input.bind(null, parent_id, perform_index));    
        }
        //Remvoe "add '+' " button
        document.getElementById(button_id).remove();

        console.log(performs);

    }

    //Deletes the perform input element and delets data in the performs[] array 
    function del_perform_input(parent_id, perform_index)
    {
        console.log(perform_index);
        for (let i = 0; i <= args.length; i++) 
        {
            if ( args[i]!=undefined && args[i]!="empty" && args[i].parent_perform_index==perform_index)
            {
                if (!!document.getElementById("perform"+perform_index)) 
                {document.getElementById(args[i]._id).remove();}
                args[i]._id = "empty";
                args[i].parent_perform_index = "empty";
                args[i].arg_number = "empty";
                args[i].value = "empty";
            }
        }

        
        performs[perform_index]._id = "empty";
        performs[perform_index].parent_node_id = "empty";
        performs[perform_index].value = "empty";

        
        if (!!document.getElementById("perform"+perform_index)) 
        {
            document.getElementById("prf_del_btn"+perform_index).remove();
            document.getElementById("perform"+perform_index).remove();
            add_perform_button(parent_id);
        }

        console.log(performs);
        console.log(args);
    }
}


//--------------
//ANSWER ELEMENT
{

    //Add answer button
    function add_answer_button(parent_id)
    {
        //Create button
        let answer_add_btn = document.createElement("button");
        answer_add_btn.innerHTML = "answer add";
        
        //Set id for button 
        let id_name = "answer_add_btn";
        let btn_index=0;
        //Check how many buttons present on DOM
        while (!!document.getElementById("answer_add_btn"+btn_index)) {
            btn_index++;
        }
        answer_add_btn.setAttribute("id",id_name+btn_index);

        //Append button to DOM
        document.getElementById(parent_id).getElementsByClassName("item mid")[0].appendChild(answer_add_btn);
        
        //Add event listener
        answer_add_btn.addEventListener("click",add_answer_input.bind(null, parent_id, id_name+btn_index));
        
        
    }

    function add_answer_input(parent_id, button_id)
    {
    
        //Remove add button that called this function 
        //document.getElementById(button_id).remove();

        //let parent_node_id = nodes[parent_node_index]._id;
        
        //Check how many answers this parent_node has
        let count = 0;
        for (let i = 0; i <= answers.length; i++) 
        {
            if (answers[i]!=undefined && answers[i].parent_node_id == parent_id)
            {count++;}
            
        }
        //If less than 4 add new answer
        if (count<4)
        {
            let answer_index = 0;
            while (answer_index <= answers.length) {
                if (answers[answer_index]==undefined || answers[answer_index]._id=="empty")
                {
                    answers[answer_index] = new Answer(answer_index,parent_id);
                    
                    //Add answer perform button
                    add_perform_button("answer"+answer_index);
                    
                    break;
                }
                answer_index++;
            }

            let answer_element = document.getElementById("answer"+answer_index);
            //Add answer output
            console.log(parent_id);
            let apoint = add_point("output","answer"+answer_index);
            answer_element.getElementsByClassName("item right")[0].appendChild(apoint);
            console.log(points);

            //Perform script parent node silinince verileri sil
            //Silme butonunu bul
            delid = parent_id.slice(4,8);
            delelement = document.getElementById("del"+delid);
            //silme event listener ekle
            delelement.addEventListener("click",del_answer_input.bind(null, parent_id, answer_index));    
        
            //Add delete button
            let answ_del_btn = document.createElement("button");
            answ_del_btn.innerHTML = "X";
            answ_del_btn.setAttribute("id","answ_del_btn"+answer_index);
            answ_del_btn.addEventListener("click",del_answer_input.bind(null,parent_id,answer_index));
            answer_element.getElementsByClassName("item mid")[0].appendChild(answ_del_btn);
            
        }

        
        
    }

    function del_answer_input(parent_id, answer_index)
    {
        
        let answer_id = "answer"+answer_index;
        //Remove array list here!!

        answers[answer_index].parent_node_id = "empty";
        answers[answer_index]._id = "empty";
        console.log(answers);

        //Remove speak data of this answer
        for (let i = 0; i < speaks.length; i++) 
        {
            if (speaks[i].parent_node_id==answer_id) 
            {
                speaks[i]._id             = "empty";
                speaks[i].parent_node_id  = "empty";
                speaks[i].value           = "empty";    
            }    
            
        }
        //Remove point data of this answer
        for (let i = 0; i < points.length; i++) 
        { 
            //Bu nodeun pointi bul
            if (points[i].parent_node_id == answer_id)
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

        for (let i = 0; i < performs.length; i++) 
        {
            if (performs[i].parent_node_id == answer_id)
            {
                del_perform_input(answer_id,i);
            }
        }

        //Remove answer elements
        if (!!document.getElementById("answer"+answer_index)) 
        {
            document.getElementById("answer"+answer_index).remove();
        }
        //Add add button
        /*
        add_answer_button(parent_node_index,answer_index);
        */
        
    }

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

                            console.log(answers);
                            add_answer_button(nodes[i]._id);
                            add_perform_button(nodes[i]._id);
                            
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
function editor_move()
{
    if (active)
    {

        //Check if parent of the answer moved
        let answer_parent_cache = [];
        answers.forEach(element => {
            if (element.parent_node_id == node_id)
            {
                //If answers parent node moved put them in array
                answer_parent_cache.push(element._id);
            }
        });

        console.log(answer_parent_cache);

        for (let i = 0; i < points.length; i++) 
        {
            //Bu node'un  outputu bul
            if ( points[i].type == "output" && answer_parent_cache.includes(points[i].parent_node_id))   
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
                        let startx = rect.left + 7 + window.scrollX;
                        let starty = rect.top + 7 + window.scrollY;
                        let endx = parseInt( all_points[2].split(",")[0] );
                        let endy = parseInt( all_points[2].split(",")[1] );
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
}

//---------------------------------------
//INDEX INPUT END
//---------------------------------------

