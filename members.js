// Members Page JavaScript
class MemberAuthentication {
    constructor() {
        this.authorizedEmails = [
            'xplosive669@gmail.com',
            'rita.kbiswas@gmail.com'
        ];
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        const elements = {
            verifyBtn: document.getElementById('verifyMember'),
            emailInput: document.getElementById('memberEmail')
        };
        
        if (elements.verifyBtn && elements.emailInput) {
            const verify = () => this.verifyMembership();
            elements.verifyBtn.addEventListener('click', verify);
            elements.emailInput.addEventListener('keypress', (e) => e.key === 'Enter' && verify());
        }

        localStorage.removeItem('dfj-member-auth');
    }

    verifyMembership() {
        const email = document.getElementById('memberEmail').value.trim().toLowerCase();
        const messageEl = document.getElementById('authMessage');

        if (!email) {
            this.showMessage('Please enter your email address.', 'error');
            return;
        }

        if (this.authorizedEmails.includes(email)) {
            this.isAuthenticated = true;
            // Show success message
            this.showMessage('✅ Access granted! Loading member content...', 'success');
            // Show membership tier selection
            setTimeout(() => this.showTierSelection(email), 500);
        } else {
            this.showMessage('❌ Access Denied. This email is not registered for premium membership.', 'error');
        }
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('authMessage');
        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
    }

    // Consolidated tier configuration
    getTierConfig() {
        return [
            { name: 'bronze', icon: 'fas fa-medal', title: 'Bronze Member', desc: 'Basic exclusive recipes', price: '₹99/month', recipes: 4, videos: 3 },
            { name: 'silver', icon: 'fas fa-trophy', title: 'Silver Member', desc: 'Premium recipes + Early access', price: '₹199/month', recipes: 7, videos: 5, earlyAccess: true },
            { name: 'gold', icon: 'fas fa-crown', title: 'Gold Member', desc: 'All content + Live sessions', price: '₹299/month', recipes: -1, videos: -1, earlyAccess: true, liveAccess: true }
        ];
    }

    showTierSelection(email) {
        const authCard = document.querySelector('.auth-card');
        const tiers = this.getTierConfig();
        
        authCard.innerHTML = `
            <h2>Select Your Membership Tier</h2>
            <p>Choose your membership level to access exclusive content</p>
            <div class="tier-selection">
                ${tiers.map(tier => `
                    <div class="tier-card ${tier.name}" data-tier="${tier.name}">
                        <i class="${tier.icon}"></i>
                        <h3>${tier.title}</h3>
                        <p>${tier.desc}</p>
                        <span class="tier-price">${tier.price}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Use event delegation for better performance
        authCard.addEventListener('click', (e) => {
            const tierCard = e.target.closest('.tier-card');
            if (tierCard) {
                this.showMemberContent(tierCard.dataset.tier);
            }
        });
    }
    
    showMemberContent(tier = 'bronze') {
        const tierConfig = this.getTierConfig().find(t => t.name === tier);
        
        // Hide auth section
        document.querySelector('.auth-section').style.display = 'none';
        
        // Show content sections based on tier capabilities
        const sections = {
            'exclusiveContent': true,
            'specialVideosContent': true,
            'earlyAccessContent': tierConfig.earlyAccess,
            'liveSessionsContent': tierConfig.liveAccess
        };
        
        Object.entries(sections).forEach(([id, show]) => {
            const element = document.getElementById(id);
            if (element) element.style.display = show ? 'block' : 'none';
        });
        
        // Load content based on tier
        this.loadExclusiveRecipes(tier);
        this.loadSpecialVideos(tier);
    }

    // Consolidated content creation helper
    createContentCard(item, type = 'recipe') {
        const isRecipe = type === 'recipe';
        const metaContent = isRecipe ? 
            `<span><i class="fas fa-clock"></i> ${item.time}</span>
             <span><i class="fas fa-signal"></i> ${item.difficulty}</span>
             <span><i class="fas fa-crown"></i> Premium</span>` :
            `<span><i class="fas fa-play"></i> ${item.time}</span>
             <span><i class="fas fa-${item.earlyAccess ? 'bolt' : 'crown'}"></i> ${item.earlyAccess ? 'Early Access' : 'Premium'}</span>`;
        
        return `
            <div class="recipe-item">
                <div class="recipe-card-full recipe-card-unlocked">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="recipe-content">
                        <h3>${item.title}</h3>
                        <p class="recipe-desc">${item.desc}</p>
                        <div class="recipe-meta">${metaContent}</div>
                        <div class="video-link">
                            <a href="${item.videoUrl || 'https://youtube.com/@debsflavorjunction?si=5f8spOsoht48cDJE'}" target="_blank">
                                <i class="fab fa-youtube"></i> ${isRecipe ? 'Watch Premium Video' : 'Watch Video'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadExclusiveRecipes(tier = 'bronze') {
        const recipesGrid = document.querySelector('.exclusive-recipes .recipes-grid');
        const exclusiveRecipes = [
            {
                title: 'গোপন পারিবারিক বিরিয়ানি | Secret Family Biryani',
                desc: 'Our family\'s secret biryani recipe passed down for generations',
                image: 'https://via.placeholder.com/300x200/4a4a4a/ffffff?text=Secret+Biryani',
                time: '2 hours',
                difficulty: 'Expert',
                videoUrl: 'https://youtube.com/@debsflavorjunction?si=5f8spOsoht48cDJE'
            },
            {
                title: 'রাজকীয় মাটন কোর্মা | Royal Mutton Korma',
                desc: 'Authentic royal-style mutton korma with secret spices',
                image: 'https://via.placeholder.com/300x200/5a5a5a/ffffff?text=Royal+Korma',
                time: '90 mins',
                difficulty: 'Hard',
                videoUrl: 'https://youtube.com/@debsflavorjunction?si=5f8spOsoht48cDJE'
            },
            {
                title: 'বিশেষ চিংড়ি মালাইকারি | Special Prawn Malaikari',
                desc: 'Premium prawn curry with coconut milk and special herbs',
                image: 'https://via.placeholder.com/300x200/6a6a6a/ffffff?text=Prawn+Malaikari',
                time: '45 mins',
                difficulty: 'Medium',
                videoUrl: 'https://youtube.com/@debsflavorjunction?si=5f8spOsoht48cDJE'
            },
            {
                title: 'হীরক রাজার মিষ্টি | Diamond King\'s Sweet',
                desc: 'Exclusive sweet recipe from royal Bengali kitchen',
                image: 'https://via.placeholder.com/300x200/7a7a7a/ffffff?text=Diamond+Sweet',
                time: '3 hours',
                difficulty: 'Expert',
                videoUrl: 'https://youtube.com/@debsflavorjunction?si=5f8spOsoht48cDJE'
            }
        ];

        const recipeCount = tier === 'bronze' ? 4 : tier === 'silver' ? 7 : exclusiveRecipes.length;
        recipesGrid.innerHTML = exclusiveRecipes.slice(0, recipeCount).map(recipe => this.createContentCard(recipe, 'recipe')).join('');
        
        // Add click handlers for premium recipes
        this.addPremiumRecipeHandlers();
    }
    
    loadSpecialVideos(tier) {
        const specialVideos = [
            {
                title: 'Advanced Bengali Cooking Techniques',
                desc: 'Master professional Bengali cooking methods',
                image: 'dfj recipe imgs/moglai paratha recipe.jpg',
                time: '45 mins'
            },
            {
                title: 'Secret Spice Blending Methods',
                desc: 'Learn the art of traditional spice mixing',
                image: 'dfj recipe imgs/Dosa Batter.jpg',
                time: '30 mins'
            },
            {
                title: 'Traditional Clay Pot Cooking',
                desc: 'Authentic Bengali clay pot techniques',
                image: 'dfj recipe imgs/90\'s Chicken Recipie.jpg',
                time: '60 mins'
            },
            {
                title: 'Bengali Sweet Making Masterclass',
                desc: 'Professional sweet preparation secrets',
                image: 'dfj recipe imgs/Carrot Kheer.jpg',
                time: '90 mins'
            },
            {
                title: 'Fish Cutting and Preparation',
                desc: 'Expert fish handling techniques',
                image: 'dfj recipe imgs/Ol kopi diye rui macher jhol.jpg',
                time: '25 mins'
            },
            {
                title: 'Authentic Biryani Layering',
                desc: 'Perfect biryani layering methods',
                image: 'dfj recipe imgs/Basanti Pulao.jpg',
                time: '40 mins'
            },
            {
                title: 'Bengali Festival Cooking',
                desc: 'Special occasion recipe collection',
                image: 'dfj recipe imgs/Christmas Cake.jpg',
                time: '75 mins'
            }
        ];
        
        const earlyAccessVideos = [
            {
                title: 'Upcoming Recipe Previews',
                desc: 'Sneak peek at new recipes',
                image: 'dfj recipe imgs/Non veg doi patal.jpg',
                time: '15 mins'
            },
            {
                title: 'Behind the Scenes Content',
                desc: 'Kitchen setup and preparation',
                image: 'dfj recipe imgs/Kadhai Chicken Recipe.jpg',
                time: '20 mins'
            },
            {
                title: 'Live Cooking Sessions Preview',
                desc: 'Highlights from live sessions',
                image: 'dfj recipe imgs/Chingrir Bharta .jpg',
                time: '30 mins'
            },
            {
                title: 'Q&A with Chef Debdas',
                desc: 'Exclusive chef interviews',
                image: 'dfj recipe imgs/Shimer Pokoda recipe.jpg',
                time: '25 mins'
            },
            {
                title: 'Seasonal Special Recipes',
                desc: 'Limited time seasonal dishes',
                image: 'dfj recipe imgs/Non Veg Chili Soyabean Recipe.jpg',
                time: '35 mins'
            }
        ];
        
        // Load special videos based on tier
        const specialGrid = document.getElementById('specialVideosGrid');
        const videosToShow = tier === 'bronze' ? specialVideos.slice(0, 3) : 
                            tier === 'silver' ? specialVideos.slice(0, 5) : specialVideos;
        
        if (specialGrid) {
            specialGrid.innerHTML = videosToShow.map(video => this.createContentCard(video, 'video')).join('');
        }
        
        // Load early access videos for silver and gold
        if (tier === 'silver' || tier === 'gold') {
            const earlyGrid = document.getElementById('earlyAccessGrid');
            if (earlyGrid) {
                earlyGrid.innerHTML = earlyAccessVideos.map(video => this.createContentCard({...video, earlyAccess: true}, 'video')).join('');
            }
        }
    }

    addPremiumRecipeHandlers() {
        const recipeCards = document.querySelectorAll('.recipe-card-unlocked');
        recipeCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.video-link')) return;
                this.showPremiumRecipeModal(card);
            });
        });
    }

    showPremiumRecipeModal(card) {
        const modal = document.createElement('div');
        modal.className = 'recipe-modal premium-modal active';
        
        const { textContent: title } = card.querySelector('h3');
        const img = card.querySelector('img');
        const { textContent: desc } = card.querySelector('.recipe-desc');
        
        const bodyContent = `
            <img src="${img.src}" alt="${img.alt}">
            <h3>${title}</h3>
            <p class="recipe-desc">${desc}</p>
            <div class="premium-badge-modal">
                <i class="fas fa-crown"></i> Members Only Content
            </div>
            <div class="recipe-ingredients">
                <h4>Premium Ingredients:</h4>
                <ul>
                    <li>Secret spice blend (exclusive recipe)</li>
                    <li>Premium quality ingredients</li>
                    <li>Traditional cooking methods</li>
                    <li>Family secret techniques</li>
                </ul>
            </div>
            <div class="recipe-instructions">
                <h4>Detailed Instructions:</h4>
                <ol>
                    <li>Follow our exclusive video tutorial for best results</li>
                    <li>Use the premium ingredient list provided</li>
                    <li>Apply traditional Bengali cooking techniques</li>
                    <li>Enjoy your authentic Bengali masterpiece!</li>
                </ol>
            </div>
            <div class="video-link">
                <a href="https://youtube.com/@debsflavorjunction?si=5f8spOsoht48cDJE" target="_blank">
                    <i class="fab fa-youtube"></i> Watch Premium Tutorial
                </a>
            </div>
        `;
        
        modal.innerHTML = `
            <div class="recipe-modal-content premium-modal-content">
                <div class="recipe-modal-header premium-header">
                    <h4><i class="fas fa-crown"></i> Premium Recipe</h4>
                    <button class="recipe-modal-close">&times;</button>
                </div>
                <div class="recipe-modal-body">${bodyContent}</div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('.recipe-modal-close')) {
                this.closePremiumModal(modal);
            }
        });
    }

    closePremiumModal(modal) {
        Utils.closeModal(modal);
        modal.remove();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MemberAuthentication();
    
    // Add premium styling to modal
    const style = document.createElement('style');
    style.textContent = `
        .premium-modal-content {
            border: 2px solid #ffd700;
            box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
        }
        
        .premium-header {
            background: linear-gradient(45deg, #ffd700, #ffb347);
            color: #333;
        }
        
        .premium-badge-modal {
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            text-align: center;
            margin: 1rem 0;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
});