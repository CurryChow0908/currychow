// 抖音视频feed流交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 视频切换功能
    let currentVideoIndex = 0;
    const videoItems = document.querySelectorAll('.video-item');
    const videoFeed = document.querySelector('.video-feed');
    
    // 导航标签切换
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            navTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 底部导航切换
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item:not(.add-btn)');
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            bottomNavItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 点赞功能
    // 点赞功能（使用事件委托）
    document.addEventListener('click', function(e) {
        const likeBtn = e.target.closest('.like-btn');
        if (!likeBtn) return;
        
        const currentVideo = likeBtn.closest('.video-item');
        const likeCount = likeBtn.parentElement.querySelector('.action-count');
        
        if (likeBtn.classList.contains('liked')) {
            likeBtn.classList.remove('liked');
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
        } else {
            likeBtn.classList.add('liked');
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
            
            // 点赞动画效果
            likeBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                likeBtn.style.transform = 'scale(1)';
            }, 150);
        }
    });

    // 收藏功能（使用事件委托）
    document.addEventListener('click', function(e) {
        const starBtn = e.target.closest('.star-btn');
        if (!starBtn) return;
        
        const starCount = starBtn.parentElement.querySelector('.action-count');
        
        if (starBtn.classList.contains('starred')) {
            starBtn.classList.remove('starred');
            starCount.textContent = parseInt(starCount.textContent) - 1;
        } else {
            starBtn.classList.add('starred');
            starCount.textContent = parseInt(starCount.textContent) + 1;
        }
    });

    // 评论区功能（使用事件委托）
    document.addEventListener('click', function(e) {
        // 打开评论区
        if (e.target.closest('.comment-btn')) {
            console.log('打开评论区');
            // 获取当前视频
            const currentVideo = e.target.closest('.video-item');
            const currentIndex = Array.from(videoItems).indexOf(currentVideo);
            
            // 隐藏所有评论区
            document.querySelectorAll('.comment-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // 显示当前视频对应的评论区
            const commentSection = document.getElementById(`commentSection${currentIndex + 1}`);
            commentSection.classList.add('active');
            
            // 视频容器缩小
            videoFeed.classList.add('shrink');
            
            // 缩小当前视频的视频容器和占位图
            const currentVideoContainer = currentVideo.querySelector('.video-container');
            const currentVideoPlaceholder = currentVideo.querySelector('.video-placeholder');
            currentVideoContainer.classList.add('shrink');
            currentVideoPlaceholder.classList.add('shrink');
        }
        
        // 关闭评论区
        if (e.target.closest('.close-btn')) {
            console.log('关闭评论区');
            const closeBtn = e.target.closest('.close-btn');
            const videoIndex = closeBtn.dataset.video;
            
            // 隐藏当前评论区
            const commentSection = document.getElementById(`commentSection${videoIndex}`);
            commentSection.classList.remove('active');
            
            // 视频容器恢复
            videoFeed.classList.remove('shrink');
            
            // 恢复所有视频的视频容器和占位图
            videoItems.forEach(videoItem => {
                const videoContainer = videoItem.querySelector('.video-container');
                const videoPlaceholder = videoItem.querySelector('.video-placeholder');
                if (videoContainer) videoContainer.classList.remove('shrink');
                if (videoPlaceholder) videoPlaceholder.classList.remove('shrink');
            });
        }
        
        // 评论发布功能
        if (e.target.closest('.input-actions')) {
            const inputActions = e.target.closest('.input-actions');
            const commentInput = inputActions.previousElementSibling;
            const commentText = commentInput.value.trim();
            
            if (commentText) {
                console.log('发布评论:', commentText);
                
                // 获取当前评论区
                const commentSection = inputActions.closest('.comment-section');
                const commentList = commentSection.querySelector('.comment-list');
                
                // 创建新评论元素
                const newComment = document.createElement('div');
                newComment.className = 'comment-item';
                
                // 构建评论HTML，包含表情状态条
                let commentHTML = `
                    <div class="comment-avatar">
                        <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20avatar%20boy%20with%20black%20hair%20cool%20manga%20style&image_size=square" alt="我的头像">
                    </div>
                    <div class="comment-content">
                        <div class="comment-header-row">
                            <span class="comment-username">黑默默默 <span class="me-tag">我</span></span>`;

                // 如果用户选择了表情，添加表情状态条在用户名右侧
                if (selectedEmoji) {
                    commentHTML += `
                            <div class="emoji-status-bar">
                                <img src="${selectedEmoji.src}" class="status-emoji" alt="${selectedEmoji.alt}">
                            </div>`;
                }

                commentHTML += `
                            <span class="comment-time">刚刚</span>
                        </div>
                        <p class="comment-text">${commentText}</p>
                        <div class="comment-actions">
                            <button class="like-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 20C8 16 2 12 2 6C2 3 4 1 7 1C9 1 10 2 12 4C14 2 15 1 17 1C20 1 22 3 22 6C22 12 16 16 12 20Z" fill="#999"/>
                                </svg>
                                <span>0</span>
                            </button>
                            <button class="reply-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="#999"/>
                                </svg>
                                <span>回复</span>
                            </button>
                        </div>
                        <div class="comment-reply">
                            <a href="#" class="publish-link">去发布作品</a>
                        </div>
                    </div>
                `;
                
                newComment.innerHTML = commentHTML;
                
                // 将新评论添加到列表顶部
                commentList.insertBefore(newComment, commentList.firstChild);
                
                // 清空输入框
                commentInput.value = '';
                
                // 滚动到新评论
                newComment.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // 回车键发布评论（使用事件委托）
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('comment-input')) {
            const commentInput = e.target;
            const commentText = commentInput.value.trim();
            
            if (commentText) {
                console.log('发布评论:', commentText);
                
                // 获取当前评论区
                const commentSection = commentInput.closest('.comment-section');
                const commentList = commentSection.querySelector('.comment-list');
                
                // 创建新评论元素
                const newComment = document.createElement('div');
                newComment.className = 'comment-item';
                
                // 构建评论HTML，包含表情状态条
                let commentHTML = `
                    <div class="comment-avatar">
                        <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20style%20avatar%20boy%20with%20black%20hair%20cool%20manga%20style&image_size=square" alt="我的头像">
                    </div>
                    <div class="comment-content">
                        <div class="comment-header-row">
                            <span class="comment-username">黑默默默 <span class="me-tag">我</span></span>`;

                // 如果用户选择了表情，添加表情状态条在用户名右侧
                if (selectedEmoji) {
                    commentHTML += `
                            <div class="emoji-status-bar">
                                <img src="${selectedEmoji.src}" class="status-emoji" alt="${selectedEmoji.alt}">
                            </div>`;
                }

                commentHTML += `
                            <span class="comment-time">刚刚</span>
                        </div>
                        <p class="comment-text">${commentText}</p>
                        <div class="comment-actions">
                            <button class="like-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 20C8 16 2 12 2 6C2 3 4 1 7 1C9 1 10 2 12 4C14 2 15 1 17 1C20 1 22 3 22 6C22 12 16 16 12 20Z" fill="#999"/>
                                </svg>
                                <span>0</span>
                            </button>
                            <button class="reply-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="#999"/>
                                </svg>
                                <span>回复</span>
                            </button>
                        </div>
                        <div class="comment-reply">
                            <a href="#" class="publish-link">去发布作品</a>
                        </div>
                    </div>
                `;
                
                newComment.innerHTML = commentHTML;
                
                // 将新评论添加到列表顶部
                commentList.insertBefore(newComment, commentList.firstChild);
                
                // 清空输入框
                commentInput.value = '';
                
                // 滚动到新评论
                newComment.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // 触摸事件变量
    let touchStartY = 0;
    let touchEndY = 0;
    
    // 触摸开始事件
    videoFeed.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    // 触摸结束事件
    videoFeed.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }, { passive: true });
    
    // 鼠标事件（桌面端支持）
    let mouseStartY = 0;
    let isMouseDown = false;
    
    videoFeed.addEventListener('mousedown', function(e) {
        mouseStartY = e.clientY;
        isMouseDown = true;
    });
    
    videoFeed.addEventListener('mouseup', function(e) {
        if (isMouseDown) {
            const mouseEndY = e.clientY;
            const swipeDistance = mouseEndY - mouseStartY;
            
            // 只有当鼠标按下和松开之间有足够的垂直移动距离时才触发
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance < 0) {
                    // 向上拖动，下一个视频
                    nextVideo();
                } else {
                    // 向下拖动，上一个视频
                    prevVideo();
                }
            }
            isMouseDown = false;
        }
    });
    
    // 处理滑动逻辑
    function handleSwipe() {
        const swipeThreshold = 50; // 滑动阈值
        const swipeDistance = touchEndY - touchStartY;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance < 0) {
                // 向上滑动，下一个视频
                nextVideo();
            } else {
                // 向下滑动，上一个视频
                prevVideo();
            }
        }
    }
    
    // 切换到下一个视频
    function nextVideo() {
        if (currentVideoIndex < videoItems.length - 1) {
            videoItems[currentVideoIndex].classList.remove('active');
            videoItems[currentVideoIndex].classList.add('next');
            
            currentVideoIndex++;
            videoItems[currentVideoIndex].classList.add('active');
            
            // 重置动画类
            setTimeout(() => {
                videoItems[currentVideoIndex - 1].classList.remove('next');
            }, 500);
        }
    }
    
    // 切换到上一个视频
    function prevVideo() {
        if (currentVideoIndex > 0) {
            videoItems[currentVideoIndex].classList.remove('active');
            videoItems[currentVideoIndex].classList.add('prev');
            
            currentVideoIndex--;
            videoItems[currentVideoIndex].classList.add('active');
            
            // 重置动画类
            setTimeout(() => {
                videoItems[currentVideoIndex + 1].classList.remove('prev');
            }, 500);
        }
    }
    
    // 初始化视频切换功能
    function initVideoSwipe() {
        // 确保第一个视频是活动状态
        if (videoItems.length > 0) {
            videoItems[0].classList.add('active');
        }
    }
    
    // 调用初始化函数
    initVideoSwipe();

    // 分享按钮（使用事件委托）
    document.addEventListener('click', function(e) {
        if (e.target.closest('.share-btn')) {
            console.log('打开分享选项');
            // 这里可以添加打开分享选项的逻辑
        }
    });

    // 头像和关注按钮
    const avatar = document.querySelector('.avatar-container');
    const followBtn = document.querySelector('.follow-btn');
    
    followBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('点击关注');
        // 这里可以添加关注逻辑
        this.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });



    // 弹幕按钮（使用事件委托）
    document.addEventListener('click', function(e) {
        const danmakuBtn = e.target.closest('.danmaku-btn');
        if (danmakuBtn) {
            console.log('切换弹幕');
            // 获取当前视频
            const currentVideo = danmakuBtn.closest('.video-item');
            // 隐藏当前视频的所有表情
            const emojiDisplay = currentVideo.querySelector('.emoji-display');
            if (emojiDisplay) {
                const emojiMessages = emojiDisplay.querySelectorAll('.emoji-message');
                emojiMessages.forEach(emoji => {
                    emoji.style.animation = 'wheelFade 0.2s ease-out forwards';
                    setTimeout(() => {
                        emoji.remove();
                    }, 200);
                });
            }
            // 切换弹幕按钮状态
            danmakuBtn.classList.toggle('disabled');
        }
    });

    // 展开/收起描述
    const expandTag = document.querySelector('.expand-tag');
    const videoDesc = document.querySelector('.video-desc');
    let isExpanded = false;
    
    expandTag.addEventListener('click', function() {
        isExpanded = !isExpanded;
        if (isExpanded) {
            videoDesc.style.webkitLineClamp = 'unset';
            expandTag.textContent = '⌃';
        } else {
            videoDesc.style.webkitLineClamp = '2';
            expandTag.textContent = '⌄';
        }
    });

    // 视频播放/暂停
    const videoContainer = document.querySelector('.video-container');
    videoContainer.addEventListener('click', function() {
        console.log('切换播放/暂停');
        // 这里可以添加播放/暂停逻辑
    });

    // 双击点赞和轮盘选择器（使用事件委托）
    document.addEventListener('dblclick', function(e) {
        const videoContainer = e.target.closest('.video-container');
        if (!videoContainer) return;
        
        // 获取当前视频对应的点赞按钮
        const currentVideo = videoContainer.closest('.video-item');
        const currentLikeBtn = currentVideo.querySelector('.like-btn');
        const currentLikeCount = currentLikeBtn.parentElement.querySelector('.action-count');
        
        // 计算点击位置
        const rect = videoContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 弹出爱心图案（每次双击都弹出）
        const heartEl = document.createElement('div');
        heartEl.className = 'floating-heart';
        heartEl.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20C8 16 2 12 2 6C2 3 4 1 7 1C9 1 10 2 12 4C14 2 15 1 17 1C20 1 22 3 22 6C22 12 16 16 12 20Z" fill="#ff4757"/></svg>';
        heartEl.style.left = x + 'px';
        heartEl.style.top = y + 'px';
        videoContainer.appendChild(heartEl);
        
        // 爱心动画
        setTimeout(() => {
            heartEl.classList.add('heart-pop');
        }, 10);
        
        setTimeout(() => {
            heartEl.classList.remove('heart-pop');
            heartEl.classList.add('heart-fade');
        }, 800);
        
        setTimeout(() => {
            heartEl.remove();
        }, 1300);
        
        e.preventDefault();
        if (!currentLikeBtn.classList.contains('liked')) {
            // 触发当前视频的点赞按钮点击
            currentLikeBtn.classList.add('liked');
            currentLikeCount.textContent = parseInt(currentLikeCount.textContent) + 1;
            
            // 点赞动画效果
            currentLikeBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                currentLikeBtn.style.transform = 'scale(1)';
            }, 150);
        }
        
        // 获取当前视频的轮盘选择器和表情显示区域
        const wheelSelector = currentVideo.querySelector('.wheel-selector');
        const emojiDisplay = currentVideo.querySelector('.emoji-display');
        
        wheelSelector.style.left = x + 'px';
        wheelSelector.style.top = y + 'px';
        // 显示轮盘选择器
        wheelSelector.style.display = 'flex';
        
        // 隐藏引导文字（首次双击时）
        const guideText = currentVideo.querySelector('.guide-text');
        if (guideText) {
            guideText.style.animation = 'wheelFade 0.4s ease-out forwards';
            setTimeout(() => {
                guideText.style.display = 'none';
            }, 400);
        }
        
        // 计算轮盘项目位置
        const wheelItems = wheelSelector.querySelectorAll('.wheel-item');
        const wheelRadius = 60; // 轮盘半径，减小以让表情更聚拢
        const itemCount = wheelItems.length;
        
        wheelItems.forEach((item, index) => {
            const angle = (index * (360 / itemCount)) * Math.PI / 180;
            const itemX = Math.cos(angle) * wheelRadius;
            const itemY = Math.sin(angle) * wheelRadius;
            item.style.transform = `translate(${itemX}px, ${itemY}px)`;
        });
        
        // 3秒后自动隐藏轮盘
        setTimeout(() => {
            if (wheelSelector.style.display === 'flex') {
                // 添加消失动画
                wheelSelector.style.animation = 'wheelFade 0.4s ease-out forwards';
                setTimeout(() => {
                    wheelSelector.style.display = 'none';
                    wheelSelector.style.animation = '';
                }, 400);
            }
        }, 3000);
    });
    
    // 存储用户选择的表情
    let selectedEmoji = null;
    
    // 轮盘选择器点击事件（使用事件委托）
    document.addEventListener('click', function(e) {
        const wheelItem = e.target.closest('.wheel-item');
        if (wheelItem) {
            const emojiImg = wheelItem.querySelector('.wheel-icon');
            const emojiSrc = emojiImg.src;
            const emojiAlt = emojiImg.alt;
            console.log('选择了表情:', emojiAlt);

            // 存储选择的表情
            selectedEmoji = {
                src: emojiSrc,
                alt: emojiAlt
            };

            // 获取当前视频的轮盘选择器和表情显示区域
            const currentVideo = document.querySelector('.video-item.active');
            const wheelSelector = currentVideo.querySelector('.wheel-selector');

            // 添加消失动画
            wheelSelector.style.animation = 'wheelFade 0.4s ease-out forwards';
            setTimeout(() => {
                wheelSelector.style.display = 'none';
                wheelSelector.style.animation = '';
            }, 400);

            // 检查当前视频的弹幕状态
            const danmakuBtn = currentVideo.querySelector('.danmaku-btn');
            const isDanmakuEnabled = !danmakuBtn.classList.contains('disabled');
            
            if (isDanmakuEnabled) {
                // 检查当前视频是第几个视频
                const videoItems = document.querySelectorAll('.video-item');
                const currentVideoItem = document.querySelector('.video-item.active');
                const currentIndex = Array.from(videoItems).indexOf(currentVideoItem);
                
                // 根据视频索引选择不同的表情显示效果
                if (currentIndex === 0) {
                    // 第一个视频（图片）- 心形阵列
                    showAllEmojis(emojiSrc);
                } else if (currentIndex === 1) {
                    // 第二个视频（视频）- 飘落花瓣
                    showFallingPetals(emojiSrc);
                } else if (currentIndex === 2) {
                    // 第三个视频（视频）- 星星闪烁
                    showStarTwinkle(emojiSrc);
                }
            }
        }
    });

    // 显示飘落花瓣效果（用于第二个视频）
    function showFallingPetals(userEmojiSrc) {
        const currentVideo = document.querySelector('.video-item.active');
        const emojiDisplay = currentVideo.querySelector('.emoji-display');

        const petalSources = [
            'cherry_blossom-smiling_face_with_3_hearts.png',
            'cherry_blossom-two_hearts.png',
            'cherry_blossom-face_with_head_bandage.png',
            'pink_heart-cherry_blossom.png',
            'light_blue_heart-cherry_blossom.png',
            'rock-thinking_face.png'
        ];

        // 生成15-25个表情
        const count = 15 + Math.floor(Math.random() * 11);

        const videoRect = currentVideo.querySelector('.video-container').getBoundingClientRect();

        // 创建表情数组
        const emojiArray = [];
        emojiArray.push({ src: userEmojiSrc, isUser: true }); // 用户表情

        for (let i = 1; i < count; i++) {
            let src;
            if (Math.random() > 0.3) {
                src = petalSources[Math.floor(Math.random() * petalSources.length)];
            } else {
                src = userEmojiSrc;
            }
            emojiArray.push({ src: src, isUser: false });
        }

        emojiArray.forEach((emojiData, i) => {
            setTimeout(() => {
                const emojiEl = document.createElement('div');
                emojiEl.className = 'emoji-message falling-petal' + (emojiData.isUser ? ' user-emoji' : '');

                const img = document.createElement('img');
                img.src = emojiData.src;
                emojiEl.appendChild(img);

                // 随机起始位置（从顶部导航栏下方开始，更分散）
                const topNav = document.querySelector('.top-nav');
                const topNavHeight = topNav ? topNav.offsetHeight : 50;
                const startX = Math.random() * videoRect.width * 0.95;
                const startY = topNavHeight + Math.random() * 50;

                // 随机结束位置（更分散的落点）
                const endX = Math.random() * videoRect.width * 0.95;
                const endY = videoRect.height + 50;

                // 随机旋转
                const rotation = Math.random() * 360;
                const scale = 1.5 + Math.random() * 1.0;

                emojiEl.style.left = startX + 'px';
                emojiEl.style.top = startY + 'px';
                emojiEl.style.transform = `rotate(${rotation}deg) scale(${scale})`;

                emojiDisplay.appendChild(emojiEl);

                // 强制重绘
                emojiEl.offsetHeight;

                // 添加飘落动画（花瓣飘落效果：左右摇摆+旋转）
                const swayAmount = 30 + Math.random() * 40;
                emojiEl.style.transition = `all ${6 + Math.random() * 4}s ease-in-out`;
                emojiEl.style.left = (endX + (i % 2 === 0 ? swayAmount : -swayAmount)) + 'px';
                emojiEl.style.top = endY + 'px';
                emojiEl.style.transform = `rotate(${rotation + 540}deg) scale(${scale * 0.5})`;
                emojiEl.style.opacity = '0.8';

                // 全部出现后开始逐个淡出
                const totalAppearTime = (count - 1) * 150;
                setTimeout(() => {
                    emojiEl.classList.add('fade-out');
                    setTimeout(() => {
                        emojiEl.remove();
                    }, 800);
                }, totalAppearTime + 3000);
            }, i * 150);
        });
    }

    // 显示星星闪烁效果（用于第三个视频）
    function showStarTwinkle(userEmojiSrc) {
        const currentVideo = document.querySelector('.video-item.active');
        const emojiDisplay = currentVideo.querySelector('.emoji-display');

        const starSources = [
            'relaxed-cat.png',
            'two_hearts-cat.png',
            'heartbeat-feet.png',
            'hearts-feet.png',
            'kissing_heart-drooling_face.png',
            'cherry_blossom-face_with_head_bandage.png'
        ];

        // 生成15-25个表情
        const count = 15 + Math.floor(Math.random() * 11);

        const videoRect = currentVideo.querySelector('.video-container').getBoundingClientRect();

        // 创建表情数组
        const emojiArray = [];
        emojiArray.push({ src: userEmojiSrc, isUser: true }); // 用户表情

        for (let i = 1; i < count; i++) {
            let src;
            if (Math.random() > 0.3) {
                src = starSources[Math.floor(Math.random() * starSources.length)];
            } else {
                src = userEmojiSrc;
            }
            emojiArray.push({ src: src, isUser: false });
        }

        emojiArray.forEach((emojiData, i) => {
            setTimeout(() => {
                const emojiEl = document.createElement('div');
                emojiEl.className = 'emoji-message star-twinkle' + (emojiData.isUser ? ' user-emoji' : '');

                const img = document.createElement('img');
                img.src = emojiData.src;
                emojiEl.appendChild(img);

                // 随机位置
                const x = Math.random() * videoRect.width * 0.8 + videoRect.width * 0.1; // 居中分布
                const y = Math.random() * (videoRect.height - 100) + 50; // 避开顶部和底部

                // 随机大小
                const size = 0.4 + Math.random() * 0.3;

                emojiEl.style.left = x + 'px';
                emojiEl.style.top = y + 'px';
                emojiEl.style.transform = `scale(${size})`;
                emojiEl.style.opacity = '0';

                emojiDisplay.appendChild(emojiEl);

                // 强制重绘
                emojiEl.offsetHeight;

                // 淡入并开始闪烁
                emojiEl.style.transition = 'opacity 0.5s ease';
                emojiEl.style.opacity = '0.7';

                // 3-5秒后消失
                setTimeout(() => {
                    emojiEl.style.opacity = '0';
                    setTimeout(() => {
                        emojiEl.remove();
                    }, 500);
                }, 3000 + Math.random() * 2000);
            }, i * 100);
        });
    }

    // 显示用户和其他用户表情（都在心形阵列中）
    function showAllEmojis(userEmojiSrc) {
        // 获取当前视频的表情显示区域
        const currentVideo = document.querySelector('.video-item.active');
        const emojiDisplay = currentVideo.querySelector('.emoji-display');
        
        const emojiSources = [
            'fire-fire.png',
            'hearts-fire.png',
            'heart-cupid.png',
            '+1-smiling_face_with_3_hearts.png',
            'cupid-two_hearts.png',
            'laughing-smiling_face_with_3_hearts.png'
        ];

        // 生成15-25个表情
        const count = 15 + Math.floor(Math.random() * 11);

        // 心形参数方程 - 更均匀圆润的心形
        function heartX(t) {
            return 15 * Math.pow(Math.sin(t), 3);
        }

        function heartY(t) {
            return -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        }

        const videoRect = videoContainer.getBoundingClientRect();
        // 使用较小的值让心形更圆润，同时居中并偏左上
        const heartSize = Math.min(videoRect.width * 0.3, videoRect.height * 0.35);
        const centerX = videoRect.width * 0.45;
        const centerY = videoRect.height * 0.38;

        // 创建表情数组，第一个是用户表情，其余是其他用户表情
        const emojiArray = [];
        emojiArray.push({ src: userEmojiSrc, isUser: true }); // 用户表情

        for (let i = 1; i < count; i++) {
            let src;
            if (Math.random() > 0.3) {
                src = emojiSources[Math.floor(Math.random() * emojiSources.length)];
            } else {
                src = userEmojiSrc;
            }
            emojiArray.push({ src: src, isUser: false });
        }

        // 打乱顺序，让用户表情随机出现在心形阵列中
        emojiArray.sort(() => Math.random() - 0.5);

        emojiArray.forEach((emojiData, i) => {
            setTimeout(() => {
                const emojiEl = document.createElement('div');
                emojiEl.className = 'emoji-message' + (emojiData.isUser ? ' user-emoji' : '');

                const img = document.createElement('img');
                img.src = emojiData.src;
                emojiEl.appendChild(img);

                // 按心形轮廓排列
                const t = (i / count) * 2 * Math.PI;
                const x = centerX + heartX(t) * (heartSize / 16);
                const y = centerY + heartY(t) * (heartSize / 16);

                emojiEl.style.left = x + 'px';
                emojiEl.style.top = y + 'px';

                emojiDisplay.appendChild(emojiEl);

                // 最后一个表情出现后立刻开始逐个淡出
                const totalAppearTime = (count - 1) * 150; // 最后一个表情出现的时间
                setTimeout(() => {
                    emojiEl.classList.add('fade-out');
                    setTimeout(() => {
                        emojiEl.remove();
                    }, 300);
                }, totalAppearTime + i * 50); // 最后一个表情出现后开始，每个间隔50ms淡出
            }, i * 150); // 每个表情间隔150ms出现
        });
    }
    
    // 点击轮盘外区域隐藏轮盘
    document.addEventListener('click', function(e) {
        const currentVideo = document.querySelector('.video-item.active');
        const wheelSelector = currentVideo.querySelector('.wheel-selector');
        
        if (!wheelSelector.contains(e.target) && e.target !== videoContainer && wheelSelector.style.display === 'flex') {
            // 添加消失动画
            wheelSelector.style.animation = 'wheelFade 0.4s ease-out forwards';
            setTimeout(() => {
                wheelSelector.style.display = 'none';
                wheelSelector.style.animation = '';
            }, 400);
        }
    });

    console.log('抖音视频feed流页面已加载');
});
