// 图片背景移除Web界面的JavaScript逻辑

class BackgroundRemover {
    constructor() {
        this.uploadArea = document.getElementById('upload-area');
        this.fileInput = document.getElementById('file-input');
        this.previewContainer = document.getElementById('preview-container');
        this.originalPreview = document.getElementById('original-preview');
        this.resultPreview = document.getElementById('result-preview');
        this.downloadBtn = document.getElementById('download-btn');
        this.progressContainer = document.getElementById('progress-container');
        this.progressBar = document.getElementById('progress-bar');
        this.statusText = document.getElementById('status-text');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // 拖拽上传事件
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('drag-over');
        });
        
        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('drag-over');
        });
        
        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });
        
        // 点击上传事件
        this.uploadArea.addEventListener('click', () => {
            this.fileInput.click();
        });
        
        this.fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });
        
        // 下载按钮事件
        this.downloadBtn.addEventListener('click', () => {
            this.downloadResult();
        });
    }
    
    handleFile(file) {
        // 验证文件类型
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('请上传有效的图片文件 (JPG, PNG, WebP)');
            return;
        }
        
        // 显示原始图片预览
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalPreview.src = e.target.result;
            this.previewContainer.style.display = 'flex';
            this.downloadBtn.style.display = 'none';
        };
        reader.readAsDataURL(file);
        
        // 处理图片
        this.processImage(file);
    }
    
    async processImage(file) {
        this.showProgress('正在处理图片...');
        this.setProgress(0);
        
        try {
            // 创建FormData
            const formData = new FormData();
            formData.append('file', file);
            
            // 调用rembg API
            const response = await fetch('/api/remove', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`处理失败: ${response.status} ${response.statusText}`);
            }
            
            // 获取处理后的图片
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            
            // 显示结果预览
            this.resultPreview.src = imageUrl;
            this.downloadBtn.style.display = 'block';
            this.downloadBtn.dataset.url = imageUrl;
            this.downloadBtn.dataset.filename = file.name.replace(/\.[^/.]+$/, '') + '_nobg.png';
            
            this.showProgress('处理完成!');
            this.setProgress(100);
        } catch (error) {
            console.error('处理图片时出错:', error);
            this.showProgress('处理失败: ' + error.message);
            this.setProgress(0);
        }
    }
    
    showProgress(message) {
        this.progressContainer.style.display = 'block';
        this.statusText.textContent = message;
    }
    
    setProgress(percent) {
        this.progressBar.style.width = percent + '%';
    }
    
    downloadResult() {
        const url = this.downloadBtn.dataset.url;
        const filename = this.downloadBtn.dataset.filename;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundRemover();
});