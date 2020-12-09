let GLOBAL = {};

const pai         = null;
const addBtn      = null;
const notes       = null;
const note        = null;
const editBtn     = null;
const editBtnIcon = null;
const deleteBtn   = null;
const main        = null;
const textArea    = null;

$(document).ready(function() {
    
    GLOBAL.pai      = $('body').html('');
    GLOBAL.addBtn   = $('<button>').attr('id', 'add').html('<i class="fas fa-plus"></i> Nova Nota').click( () => {
                                                                                                                addNewNote();        
                                                                                                              });
    GLOBAL.notes    = JSON.parse(localStorage.getItem("notes"));
    
    //******************//
    
    $(GLOBAL.pai).append($(GLOBAL.addBtn));
    
    //******************//
    
    // Get notes in the Local Storage
    if ($(GLOBAL.notes)) {
        
        let notesData = $(GLOBAL.notes);
        
        [...notesData].forEach((note) => {
            addNewNote(note);
        });
        
    }// if ($(GLOBAL.notes))
    
});

//******************//

function addNewNote(text = "") {
    
    GLOBAL.editBtn   = $('<button><i class="fas fa-edit"></i></button>').addClass('edit').click( (event) => {
                                                                                                    
                                                                                                    let targetMain     = $(event.currentTarget).parent().parent().find('.main');
                                                                                                    let targetTextArea = $(event.currentTarget).parent().parent().find('textarea');
                                                                                                    GLOBAL.editBtnIcon = $(event.currentTarget).parent().parent().find('.edit').find('i');
                                                                                                    
                                                                                                    $(GLOBAL.editBtnIcon).toggleClass('fa-save fa-edit');
                                                                                                    
                                                                                                    targetMain.toggle("hidden");
                                                                                                    targetTextArea.toggle("hidden"); 
                                                                                                        
                                                                                                  });
    GLOBAL.deleteBtn = $('<button><i class="fas fa-trash-alt"></i></button>').addClass('delete').click( (event) => {
        
                                                                                                    let note = $(event.currentTarget).parent().parent().parent();
                                                                                                    
                                                                                                    note.remove();
                                                                                                    updateLS();
                                                                                                    
                                                                                                  });
    GLOBAL.main      = $('<div>').addClass('main');//.addClass('hidden');
    GLOBAL.textArea  = $('<textarea>').change( (event) => {
                                                
                                                let value = $(event.currentTarget).val();
                                                
                                                $(event.currentTarget).parent().find('.main').html(marked(value));
                                                
                                                updateLS();
                                                
                                             }).addClass('hidden');
    
    //******************//
    
    GLOBAL.note = $('<div>').addClass('note').append(
        $('<div>').addClass('notes').append(
            $('<div>').addClass('tools').append(
                $(GLOBAL.editBtn),
                $(GLOBAL.deleteBtn)
            ),
            $(GLOBAL.main),
            $(GLOBAL.textArea)
        )
    );
    
    //******************//
    
    // Get previous saved text
    if (text) {
        
        $(GLOBAL.main).html(marked(text));
        $(GLOBAL.textArea).val(text);
    
        //$(GLOBAL.main).toggle("hidden");
        $(GLOBAL.textArea).toggle("hidden");
        
    } else {
        
        $(GLOBAL.main).toggle("hidden");
        //$(GLOBAL.textArea).toggle("hidden");
        
        $(GLOBAL.textArea).removeClass('hidden');
        
        GLOBAL.editBtnIcon = $(GLOBAL.editBtn).find('i');
        
        $(GLOBAL.editBtnIcon).toggleClass('fa-save fa-edit');
        
    }// else if (text)
    
    
    //******************//
    
    $(GLOBAL.pai).append(
        $(GLOBAL.note)
    );
    
    
}//function addNewNote(text = "")

function updateLS() {
    
    let notesText = $(GLOBAL.pai).find('textarea');
    let notes     = [];
        
    [...notesText].forEach( (note) => {
        notes.push(note.value);
    });
    
    localStorage.setItem("notes", JSON.stringify(notes));
    
}// function updateLS()



