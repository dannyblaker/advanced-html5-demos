// Drag and Drop Implementation
// Comprehensive drag and drop functionality with file handling and advanced features

class DragDropManager {
    constructor() {
        this.init();
        this.draggedElement = null;
        this.uploadedFiles = [];
        this.taskCounter = 6;
    }

    init() {
        this.initFileDropZone();
        this.initSortableLists();
        this.initCustomDrag();
        this.initAdvancedFeatures();
        this.initEventLogging();
    }

    log(message) {
        const logElement = document.getElementById('eventLog');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${timestamp}] ${message}`;
        logElement.appendChild(logEntry);
        logElement.scrollTop = logElement.scrollHeight;
    }

    // File Drop Zone Implementation
    initFileDropZone() {
        const dropZone = document.getElementById('fileDropZone');
        const fileInput = document.getElementById('fileInput');
        const filePreview = document.getElementById('filePreview');

        // Click to select files
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change handler
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(Array.from(e.target.files));
        });

        // Drag and drop handlers
        dropZone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
            this.log('Files entered drop zone');
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        dropZone.addEventListener('dragleave', (e) => {
            if (!dropZone.contains(e.relatedTarget)) {
                dropZone.classList.remove('drag-over');
                this.log('Files left drop zone');
            }
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                this.handleFiles(files);
                this.log(`Dropped ${files.length} file(s)`);
            }
        });
    }

    handleFiles(files) {
        const filePreview = document.getElementById('filePreview');

        // Clear preview if first files
        if (this.uploadedFiles.length === 0) {
            filePreview.innerHTML = '';
        }

        files.forEach(file => {
            this.uploadedFiles.push(file);
            this.createFilePreview(file);
            this.simulateUpload(file);
        });
    }

    createFilePreview(file) {
        const filePreview = document.getElementById('filePreview');
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.id = `file-${file.name.replace(/[^a-zA-Z0-9]/g, '')}`;

        const fileIcon = document.createElement('div');
        fileIcon.className = 'file-icon';

        // Set icon based on file type
        if (file.type.startsWith('image/')) {
            fileIcon.textContent = '🖼️';
            fileIcon.style.background = '#28a745';
        } else if (file.type.startsWith('video/')) {
            fileIcon.textContent = '🎥';
            fileIcon.style.background = '#dc3545';
        } else if (file.type.startsWith('audio/')) {
            fileIcon.textContent = '🎵';
            fileIcon.style.background = '#ffc107';
        } else if (file.type.includes('pdf')) {
            fileIcon.textContent = '📄';
            fileIcon.style.background = '#17a2b8';
        } else {
            fileIcon.textContent = '📁';
            fileIcon.style.background = '#6c757d';
        }

        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';

        const fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = file.name;

        const fileSize = document.createElement('div');
        fileSize.className = 'file-size';
        fileSize.textContent = this.formatFileSize(file.size);

        fileInfo.appendChild(fileName);
        fileInfo.appendChild(fileSize);
        fileItem.appendChild(fileIcon);
        fileItem.appendChild(fileInfo);

        // Add image preview for image files
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'image-preview';
                img.alt = file.name;
                fileItem.appendChild(img);
            };
            reader.readAsDataURL(file);
        }

        filePreview.appendChild(fileItem);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    simulateUpload(file) {
        const progressBar = document.getElementById('uploadProgress');
        const progressText = document.getElementById('progressText');

        let progress = 0;
        progressText.textContent = `Uploading ${file.name}...`;

        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                progressText.textContent = `Upload complete: ${file.name}`;
                setTimeout(() => {
                    progressBar.style.width = '0%';
                    progressText.textContent = 'Ready to upload...';
                }, 2000);
            }
            progressBar.style.width = progress + '%';
        }, 200);
    }

    // Sortable Lists Implementation
    initSortableLists() {
        const lists = document.querySelectorAll('.sortable-list');

        lists.forEach(list => {
            this.setupSortableList(list);
        });

        // Setup sortable items
        document.querySelectorAll('.sortable-item').forEach(item => {
            this.setupSortableItem(item);
        });
    }

    setupSortableList(list) {
        list.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const afterElement = this.getDragAfterElement(list, e.clientY);
            const draggedItem = document.querySelector('.dragging');

            if (afterElement == null) {
                list.appendChild(draggedItem);
            } else {
                list.insertBefore(draggedItem, afterElement);
            }
        });

        list.addEventListener('drop', (e) => {
            e.preventDefault();
            const listType = list.dataset.list;
            this.log(`Task moved to ${listType} list`);
        });
    }

    setupSortableItem(item) {
        item.addEventListener('dragstart', (e) => {
            item.classList.add('dragging');
            this.draggedElement = item;
            e.dataTransfer.setData('text/plain', item.dataset.id);
            this.log(`Started dragging task: ${item.querySelector('span').textContent}`);
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            this.draggedElement = null;
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.sortable-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Custom Drag Implementation
    initCustomDrag() {
        const customDropZone = document.getElementById('customDropZone');
        const droppedContent = document.getElementById('droppedContent');

        // Setup draggable items
        document.querySelectorAll('.draggable-item[data-type]').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                const dataType = item.dataset.type;
                const content = item.dataset.content;

                // Set data for different formats
                switch (dataType) {
                    case 'text':
                        e.dataTransfer.setData('text/plain', content);
                        break;
                    case 'url':
                        e.dataTransfer.setData('text/uri-list', content);
                        break;
                    case 'html':
                        e.dataTransfer.setData('text/html', content);
                        break;
                    case 'json':
                        e.dataTransfer.setData('application/json', content);
                        break;
                }

                item.classList.add('dragging');
                this.log(`Started dragging ${dataType} data`);
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
        });

        // Setup drop zone
        customDropZone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            customDropZone.classList.add('drag-over');
        });

        customDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        customDropZone.addEventListener('dragleave', (e) => {
            if (!customDropZone.contains(e.relatedTarget)) {
                customDropZone.classList.remove('drag-over');
            }
        });

        customDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            customDropZone.classList.remove('drag-over');

            // Get data in different formats
            const textData = e.dataTransfer.getData('text/plain');
            const urlData = e.dataTransfer.getData('text/uri-list');
            const htmlData = e.dataTransfer.getData('text/html');
            const jsonData = e.dataTransfer.getData('application/json');

            let content = '<h3>Dropped Data:</h3>';

            if (textData) {
                content += `<p><strong>Text:</strong> ${textData}</p>`;
            }
            if (urlData) {
                content += `<p><strong>URL:</strong> <a href="${urlData}" target="_blank">${urlData}</a></p>`;
            }
            if (htmlData) {
                content += `<p><strong>HTML:</strong> ${htmlData}</p>`;
            }
            if (jsonData) {
                try {
                    const parsed = JSON.parse(jsonData);
                    content += `<p><strong>JSON:</strong></p><pre>${JSON.stringify(parsed, null, 2)}</pre>`;
                } catch (e) {
                    content += `<p><strong>JSON (invalid):</strong> ${jsonData}</p>`;
                }
            }

            droppedContent.innerHTML = content;
            this.log('Custom data dropped and processed');
        });
    }

    // Advanced Features Implementation
    initAdvancedFeatures() {
        const customImageDrag = document.getElementById('customImageDrag');
        const trashZone = document.getElementById('trashZone');

        // Custom drag image
        customImageDrag.addEventListener('dragstart', (e) => {
            // Create custom drag image
            const dragImage = document.createElement('div');
            dragImage.style.cssText = `
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                color: white;
                padding: 20px;
                border-radius: 10px;
                font-size: 18px;
                font-weight: bold;
                position: absolute;
                top: -1000px;
                left: -1000px;
                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            `;
            dragImage.textContent = '🚀 Custom Drag!';
            document.body.appendChild(dragImage);

            e.dataTransfer.setDragImage(dragImage, 50, 25);
            e.dataTransfer.setData('text/plain', 'custom-image-drag');

            // Clean up drag image after drag starts
            setTimeout(() => {
                document.body.removeChild(dragImage);
            }, 0);

            this.log('Started custom image drag');
        });

        // Trash zone
        trashZone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            trashZone.classList.add('drag-over');
            this.log('Item entered trash zone');
        });

        trashZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        trashZone.addEventListener('dragleave', (e) => {
            if (!trashZone.contains(e.relatedTarget)) {
                trashZone.classList.remove('drag-over');
            }
        });

        trashZone.addEventListener('drop', (e) => {
            e.preventDefault();
            trashZone.classList.remove('drag-over');

            if (this.draggedElement && this.draggedElement.classList.contains('sortable-item')) {
                this.draggedElement.style.animation = 'fadeOut 0.5s ease-in-out';
                setTimeout(() => {
                    this.draggedElement.remove();
                    this.log('Task deleted');
                }, 500);
            } else {
                this.log('Item dropped in trash');
            }
        });
    }

    initEventLogging() {
        // Log all drag and drop events for debugging
        document.addEventListener('dragstart', (e) => {
            if (!e.target.closest('#eventLog')) {
                this.log(`Drag started on: ${e.target.tagName.toLowerCase()}`);
            }
        });

        document.addEventListener('dragend', (e) => {
            if (!e.target.closest('#eventLog')) {
                this.log(`Drag ended on: ${e.target.tagName.toLowerCase()}`);
            }
        });
    }
}

// Global functions for UI controls
window.clearFiles = () => {
    const filePreview = document.getElementById('filePreview');
    filePreview.innerHTML = '<p>No files uploaded yet</p>';
    document.getElementById('fileInput').value = '';
    dragDropManager.uploadedFiles = [];
    dragDropManager.log('All files cleared');
};

window.addNewTask = () => {
    const taskText = prompt('Enter new task:');
    if (taskText) {
        const todoList = document.getElementById('todoList');
        const newTask = document.createElement('div');
        newTask.className = 'sortable-item';
        newTask.draggable = true;
        newTask.dataset.id = dragDropManager.taskCounter++;
        newTask.innerHTML = `
            <span>📝 ${taskText}</span>
            <span class="file-size">New Task</span>
        `;

        dragDropManager.setupSortableItem(newTask);
        todoList.appendChild(newTask);
        dragDropManager.log(`New task added: ${taskText}`);
    }
};

window.exportTasks = () => {
    const lists = document.querySelectorAll('.sortable-list');
    const data = {};

    lists.forEach(list => {
        const listName = list.dataset.list;
        const tasks = Array.from(list.querySelectorAll('.sortable-item')).map(item => ({
            id: item.dataset.id,
            text: item.querySelector('span').textContent,
            priority: item.querySelector('.file-size').textContent
        }));
        data[listName] = tasks;
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.click();
    URL.revokeObjectURL(url);

    dragDropManager.log('Tasks exported to JSON file');
};

window.resetTasks = () => {
    if (confirm('Reset all tasks to default state?')) {
        location.reload();
    }
};

window.clearLog = () => {
    document.getElementById('eventLog').innerHTML = '';
};

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
`;
document.head.appendChild(style);

// Initialize drag and drop manager
let dragDropManager;
document.addEventListener('DOMContentLoaded', () => {
    dragDropManager = new DragDropManager();
    dragDropManager.log('Drag and Drop system initialized');
});