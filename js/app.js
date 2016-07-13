var NoteApp = {
    notes: [],

    els: {
        notesBlock: document.getElementById('notes'),
        createNoteBtn: document.getElementById('createNoteBtn'),
        newNote: document.getElementById('noteForm'),
        saveNewNoteBtn: document.getElementById('saveBtn'),
        cancelBtn: document.getElementById('cancelBtn'),
        noteText: document.getElementById('noteText')
    },

    getDateTimeToString: function(dateTime) {
        function addZerro(numb) {
            if(numb < 10) {
                numb = '0' + numb;
            }
            return numb;
        }
        dateTime = addZerro(dateTime.getDate()) + '.' + addZerro(dateTime.getMonth()) + '.' + dateTime.getFullYear()     + ' '
            + addZerro(dateTime.getHours()) + ':' + addZerro(dateTime.getMinutes()) + ':' + dateTime.getSeconds();

        return dateTime;
    },

    renderNote: function (note) {
        var self = this;

        var noteEl = document.createElement('div');
        noteEl.className = 'note';
        noteEl.setAttribute('data-id', note.id);

        noteEl.innerHTML =
            '<div class="pull-right">' +
                '<a><span class="glyphicon glyphicon-remove text-muted remove"></span></a>' +
                '<a class="cancelRemove">Cancel remove</a>' +
            '</div>' +
            '<p>' + note.text + '</p>' +
            '<div class="text-right">' +
                this.getDateTimeToString(note.dateTime) +
            '</div>';
        this.els.notesBlock.insertBefore(noteEl, this.els.notesBlock.firstChild);

        var removeBtn = noteEl.getElementsByClassName('remove')[0];

        removeBtn.addEventListener('click', function() {
            var cancelRemoveBtn = noteEl.getElementsByClassName('cancelRemove')[0];

            removeBtn.style.display = 'none';
            cancelRemoveBtn.style.display = 'block';

            var timer = setTimeout(function() {
                for(var i = 0; i < self.notes.length; i++) {
                    if(self.notes[i].id == noteEl.getAttribute('data-id')) {
                        self.notes.splice(i, 1);
                    }
                }
                localStorage.setItem('notes', JSON.stringify(self.notes));
                self.els.notesBlock.removeChild(noteEl);
            }, 5000);

            cancelRemoveBtn.addEventListener('click', function() {
                removeBtn.style.display = 'block';
                cancelRemoveBtn.style.display = 'none';

                clearTimeout(timer);
            });
        });
    },

    renderNotes: function () {
        for (var i = this.notes.length - 1; i >= 0; i--) {
            this.renderNote(this.notes[i]);
        }
    },

    delegateEvents: function() {
        var self = this;

        this.els.createNoteBtn.addEventListener('click', function() {
            self.els.noteText.value = '';

            self.els.createNoteBtn.style.display = 'none';
            self.els.newNote.style.display = 'block';
        });
        this.els.cancelBtn.addEventListener('click', function() {
            self.els.newNote.style.display = 'none';
            self.els.createNoteBtn.style.display = 'block';
        });
        this.els.noteText.addEventListener('keyup', function() {
            setTimeout(function() {
                if(!self.els.noteText.value.trim()) {
                    self.els.saveNewNoteBtn.setAttribute('disabled', 'disabled');
                } else {
                    self.els.saveNewNoteBtn.removeAttribute('disabled');
                }
            }, 50);
        });
        this.els.noteText.addEventListener('paste', function() {
            setTimeout(function() {
                if(!self.els.noteText.value.trim()) {
                    self.els.saveNewNoteBtn.setAttribute('disabled', 'disabled');
                } else {
                    self.els.saveNewNoteBtn.removeAttribute('disabled');
                }
            }, 50);
        });
        this.els.saveNewNoteBtn.addEventListener('click', function() {
            self.els.newNote.style.display = 'none';
            self.els.createNoteBtn.style.display = 'block';

            var note = {
                id: new Date().getTime(),
                text: self.els.noteText.value,
                dateTime: new Date()
            };

            self.notes.unshift(note);

            localStorage.setItem('notes', JSON.stringify(self.notes));

            self.renderNote(note);
        });
    },

    getNotes: function() {
        var json = JSON.parse(localStorage.getItem('notes'));
        if(json != null) {
            for(var i = 0; i < json.length; i++) {
                json[i].dateTime = new Date(json[i].dateTime);
            }
            this.notes = json;
        }
    },

    start: function() {
        this.getNotes();
        this.renderNotes();
        this.delegateEvents();
    }
};

NoteApp.start();