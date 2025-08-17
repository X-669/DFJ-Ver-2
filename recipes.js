// Recipes Page JavaScript
class RecipesManager {
    constructor() {
        this.searchInput = document.getElementById('recipeSearch');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.recipeItems = document.querySelectorAll('.recipe-item');
        this.recipesGrid = document.getElementById('recipesGrid');
        
        this.init();
    }

    init() {
        // Search functionality
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // Filter functionality
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e.target.dataset.category));
        });

    }

    // Consolidated visibility handler
    updateItemVisibility(filterFn, showNoResultsCondition) {
        let visibleCount = 0;
        this.recipeItems.forEach(item => {
            const isVisible = filterFn(item);
            item.classList.toggle('hidden', !isVisible);
            if (isVisible) visibleCount++;
        });
        this.showNoResults(showNoResultsCondition(visibleCount));
        return visibleCount;
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        this.updateItemVisibility(
            item => {
                const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
                const description = item.querySelector('.recipe-desc')?.textContent.toLowerCase() || '';
                return !term || title.includes(term) || description.includes(term);
            },
            count => count === 0 && term !== ''
        );
    }

    handleFilter(category) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
        
        this.updateItemVisibility(
            item => category === 'all' || item.dataset.category === category,
            count => count === 0
        );
        
        this.searchInput.value = '';
    }

    showNoResults(show) {
        const existingMessage = document.querySelector('.no-results');
        if (show && !existingMessage) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <i class="fas fa-search"></i>
                <p>No recipes found. Try different keywords or filters.</p>
                <p>কোন রেসিপি পাওয়া যায়নি। অন্য কীওয়ার্ড বা ফিল্টার চেষ্টা করুন।</p>
            `;
            this.recipesGrid.appendChild(noResultsDiv);
        } else if (!show && existingMessage) {
            existingMessage.remove();
        }
    }
}

// Recipe Card Interactions
class RecipeCardInteractions {
    constructor() {
        this.recipeCards = document.querySelectorAll('.recipe-card-full');
        this.init();
    }

    init() {
        this.recipeCards.forEach(card => {
            // Add click to entire card
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on video link
                if (e.target.closest('.video-link')) return;
                
                this.toggleRecipeDetails(card);
            });
            
            // Add cursor pointer to indicate clickability
            card.style.cursor = 'pointer';
        });
        
        // Close modal when clicking on it
        document.addEventListener('click', (e) => {
            const modal = document.querySelector('.recipe-modal.active');
            if (modal && e.target === modal) {
                this.closeModalWithFlip();
            }
        });
    }

    toggleRecipeDetails(card) {
        const modal = document.querySelector('.recipe-modal.active');
        
        if (modal) {
            // If modal is open, close it
            this.closeModal(modal);
        } else {
            // Open modal directly without animation
            this.openRecipeModal(card);
        }
    }
    
    closeModalWithFlip(card) {
        const modal = document.querySelector('.recipe-modal.active');
        if (modal && card) {
            card.classList.add('flipping');
            
            setTimeout(() => {
                this.closeModal(modal);
                card.classList.remove('flipping');
            }, 400);
        } else if (modal) {
            this.closeModal(modal);
        }
    }
    
    openRecipeModal(card) {
        const modal = this.createModal();
        const cardData = this.extractCardData(card);
        const recipeDetails = this.getRecipeDetails(cardData.title);
        
        modal.querySelector('.recipe-modal-body').innerHTML = this.buildModalContent(cardData, recipeDetails);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    extractCardData(card) {
        return {
            img: card.querySelector('img'),
            title: card.querySelector('h3').textContent,
            desc: card.querySelector('.recipe-desc').textContent,
            meta: card.querySelector('.recipe-meta').innerHTML,
            videoLink: card.querySelector('.video-link').innerHTML
        };
    }
    
    buildModalContent(cardData, recipeDetails) {
        const createList = (items, tag) => `<${tag}>${items.map(item => `<li>${item}</li>`).join('')}</${tag}>`;
        
        return `
            <img src="${cardData.img.src}" alt="${cardData.img.alt}">
            <h3>${cardData.title}</h3>
            <p class="recipe-desc">${cardData.desc}</p>
            <div class="recipe-meta">${cardData.meta}</div>
            <div class="recipe-ingredients">
                <h4>Ingredients:</h4>
                ${createList(recipeDetails.ingredients, 'ul')}
            </div>
            <div class="recipe-instructions">
                <h4>Instructions:</h4>
                ${createList(recipeDetails.instructions, 'ol')}
            </div>
            <div class="video-link">${cardData.videoLink}</div>
        `;
    }
    
    getRecipeDetails(title) {
        // Optimized recipe data with common ingredients
        const common = {
            spices: ['Salt to taste', '1/2 tsp turmeric', '1 tsp red chili powder'],
            base: ['2 tbsp oil', '1 onion (chopped)', '2 green chilies'],
            dairy: ['1 cup milk', '2 tbsp ghee'],
            aromatics: ['1 tsp cumin seeds', '1/2 tsp cardamom powder']
        };
        
        // Optimized recipe data with helper functions
        const createRecipe = (ingredients, instructions) => ({ ingredients, instructions });
        const basicSpices = common.spices.slice(0, 1);
        
        const recipes = {
            'চালের গুড়োর ভাপা পিঠে | Steamed Rice Flour Cake': createRecipe(
                ['2 cups rice flour', '1 cup jaggery', '1 cup coconut (grated)', '1/2 cup water', ...basicSpices, 'Banana leaves for steaming'],
                ['Mix rice flour with water and salt to make dough', 'Prepare filling with jaggery and coconut', 'Make small balls and stuff with filling', 'Wrap in banana leaves', 'Steam for 15-20 minutes', 'Serve hot']
            ),
            'পাটি সাপটা পিঠে | Rolled Flat Pitha': {
                ingredients: ['2 cups rice flour', '1 cup coconut (grated)', '1/2 cup jaggery', '1 cup milk', '1/4 tsp cardamom powder', 'Ghee for cooking'],
                instructions: ['Make thin crepes with rice flour and milk', 'Cook filling with coconut, jaggery and cardamom', 'Spread filling on crepe', 'Roll tightly', 'Cut into pieces', 'Serve warm']
            },
            'নিরামিষ পনিরের রেসিপি | Vegetarian Paneer Recipe': {
                ingredients: ['250g paneer (cubed)', '2 tomatoes (chopped)', '1 tbsp ginger-garlic paste', '1 tsp cumin seeds', '1 tsp coriander powder', ...common.spices, ...common.base],
                instructions: ['Heat oil, add cumin seeds', 'Add onions and sauté until golden', 'Add ginger-garlic paste and tomatoes', 'Add spices and cook until oil separates', 'Add paneer cubes gently', 'Simmer for 5 minutes', 'Garnish with coriander']
            },
            'মান কচু বাটা | Mashed Malanga Arum': {
                ingredients: ['500g malanga arum', '2 green chilies', '1 tsp mustard oil', '1/2 tsp turmeric', 'Salt to taste', '1 onion (chopped)', 'Fresh coriander'],
                instructions: ['Boil malanga until tender', 'Mash with green chilies and salt', 'Heat mustard oil in pan', 'Add onions and turmeric', 'Add mashed malanga', 'Cook for 5 minutes', 'Garnish with coriander']
            },
            'বাসন্তী পোলাও | Basanti Pulao': {
                ingredients: ['2 cups basmati rice', '1/4 cup ghee', '1 bay leaf', '4-5 green cardamom', '1 cinnamon stick', '1/4 cup raisins', '1/4 cup cashews', 'Saffron soaked in milk', 'Salt to taste'],
                instructions: ['Soak rice for 30 minutes', 'Heat ghee, add whole spices', 'Add rice and sauté for 2 minutes', 'Add hot water and salt', 'Add saffron milk', 'Cook covered until done', 'Garnish with nuts and raisins']
            },
            'কুমড়ো পাতার ভর্তা | Mashed Pumpkin Leaves': {
                ingredients: ['2 cups pumpkin leaves (chopped)', '2 green chilies', '1 tsp mustard oil', '1/4 tsp turmeric', 'Salt to taste', '1 onion (chopped)'],
                instructions: ['Boil pumpkin leaves until soft', 'Drain and mash with chilies', 'Heat mustard oil', 'Add onions and turmeric', 'Add mashed leaves', 'Cook for 3-4 minutes', 'Season with salt']
            },
            'মায়াপুরের ইস্কনের নিরামিষ | ISKCON Vegetarian Recipe': {
                ingredients: ['2 cups mixed vegetables', '1 cup yogurt', '1 tsp cumin seeds', '1 tsp coriander powder', '1/2 tsp turmeric', 'Curry leaves', '2 tbsp ghee', 'Salt to taste'],
                instructions: ['Heat ghee, add cumin and curry leaves', 'Add vegetables and sauté', 'Add spices and cook', 'Add yogurt gradually', 'Simmer until vegetables are tender', 'Adjust seasoning', 'Serve hot']
            },
            'ডিমের কষা | Spicy Egg Curry': {
                ingredients: ['6 eggs (boiled)', '2 onions (sliced)', '2 tomatoes (chopped)', '1 tbsp ginger-garlic paste', '1 tsp red chili powder', '1/2 tsp turmeric', '1 tsp garam masala', '3 tbsp oil'],
                instructions: ['Boil and peel eggs', 'Heat oil, fry eggs lightly', 'In same oil, fry onions until brown', 'Add ginger-garlic paste', 'Add tomatoes and spices', 'Add fried eggs', 'Simmer for 10 minutes']
            },
            'ধোসার চাটনি | Dosa Chutney Recipe': {
                ingredients: ['1 cup coconut (grated)', '2 green chilies', '1 inch ginger', '1 tsp mustard seeds', '1 tsp urad dal', '10-12 curry leaves', '2 tbsp oil', 'Salt to taste'],
                instructions: ['Grind coconut, chilies, ginger with little water', 'Heat oil, add mustard seeds', 'Add urad dal and curry leaves', 'Add ground coconut paste', 'Add salt and mix well', 'Serve with dosa']
            },
            'নিরামিষ ফ্রাইড রাইস | Veg Fried Rice': {
                ingredients: ['3 cups cooked rice', '1 cup mixed vegetables', '2 eggs (beaten)', '3 cloves garlic (minced)', '2 tbsp soy sauce', '1 tbsp oil', 'Spring onions', 'Salt and pepper'],
                instructions: ['Heat oil in wok', 'Scramble eggs and set aside', 'Stir-fry vegetables and garlic', 'Add cooked rice', 'Add soy sauce and seasonings', 'Add scrambled eggs back', 'Garnish with spring onions']
            },
            'ডিম তড়কা | Egg Tadka Recipe': {
                ingredients: ['4 eggs', '1 onion (chopped)', '2 green chilies', '1 tsp cumin seeds', '1/2 tsp turmeric', '1 tsp red chili powder', '2 tbsp oil', 'Coriander leaves'],
                instructions: ['Beat eggs with salt', 'Heat oil, add cumin seeds', 'Add onions and green chilies', 'Add spices and cook', 'Pour beaten eggs', 'Scramble gently', 'Garnish with coriander']
            },
            'মোগলাই পরোটা | Mughlai Paratha Recipe': {
                ingredients: ['2 cups flour', '2 eggs', '1 onion (chopped)', '100g minced meat', '1 tsp garam masala', 'Ghee for cooking', 'Salt to taste'],
                instructions: ['Make soft dough with flour', 'Cook minced meat with spices', 'Beat eggs with onions', 'Roll paratha, add egg mixture', 'Add meat filling', 'Fold and cook with ghee', 'Serve hot']
            },
            'গাজরের ক্ষীর | Carrot Pudding Recipe': {
                ingredients: ['4 cups grated carrots', '1 liter milk', '1/2 cup sugar', '1/4 cup condensed milk', '1/4 cup nuts (chopped)', '1/2 tsp cardamom powder'],
                instructions: ['Boil milk until reduced to half', 'Add grated carrots', 'Cook until carrots are soft', 'Add sugar and condensed milk', 'Add cardamom powder', 'Garnish with nuts', 'Serve chilled']
            },
            'ধোসার ব্যাটার | Dosa Batter Recipe': {
                ingredients: ['3 cups rice', '1 cup urad dal', '1/2 tsp fenugreek seeds', 'Salt to taste', 'Water as needed'],
                instructions: ['Soak rice and dal separately for 4 hours', 'Grind urad dal to smooth paste', 'Grind rice coarsely', 'Mix both batters', 'Add salt and ferment for 8 hours', 'Use for making dosas']
            },
            'তেল পিঠে | Oil-Fried Pitha': {
                ingredients: ['2 cups rice flour', '1 cup jaggery', '1 cup coconut (grated)', '1/2 tsp cardamom powder', 'Oil for frying', 'Water as needed'],
                instructions: ['Make dough with rice flour and water', 'Prepare filling with jaggery and coconut', 'Make small balls and stuff', 'Shape into small cakes', 'Deep fry until golden', 'Serve hot']
            },
            'মুরগির মাংস | Chicken Curry Recipe': {
                ingredients: ['1kg chicken (cut pieces)', '2 onions (sliced)', '2 tbsp ginger-garlic paste', '2 tomatoes (chopped)', '1 tsp red chili powder', '1/2 tsp turmeric', '1 tsp garam masala', '4 tbsp oil'],
                instructions: ['Marinate chicken with spices', 'Heat oil, fry onions until brown', 'Add ginger-garlic paste', 'Add tomatoes and cook', 'Add marinated chicken', 'Cook covered for 30 minutes', 'Garnish with coriander']
            },
            'নিরামিষ দই পটল | Vegetarian Doi Potol': {
                ingredients: ['500g pointed gourd', '1 cup yogurt', '1 tsp cumin seeds', '1 tsp coriander powder', '1/2 tsp turmeric', '2 green chilies', '2 tbsp oil', 'Salt to taste'],
                instructions: ['Cut pointed gourd into pieces', 'Heat oil, add cumin seeds', 'Add pointed gourd and fry', 'Add spices and green chilies', 'Add beaten yogurt', 'Simmer until tender', 'Serve hot']
            },
            'কড়াই চিকেন | Kadhai Chicken Recipe': {
                ingredients: ['750g chicken (cubed)', '2 bell peppers', '2 onions', '2 tbsp ginger-garlic paste', '2 tsp coriander seeds', '1 tsp red chili powder', '3 tbsp oil', 'Garam masala'],
                instructions: ['Dry roast and grind coriander seeds', 'Heat oil in kadhai', 'Add chicken and cook', 'Add onions and bell peppers', 'Add ginger-garlic paste', 'Add spices and cook', 'Garnish with garam masala']
            },
            'চিংড়ির ভর্তা | Mashed Prawn Dish': {
                ingredients: ['500g prawns', '2 onions (chopped)', '3 green chilies', '1 tsp turmeric', '1 tsp red chili powder', '3 tbsp mustard oil', 'Salt to taste'],
                instructions: ['Clean and boil prawns', 'Mash prawns coarsely', 'Heat mustard oil', 'Add onions and chilies', 'Add spices and cook', 'Add mashed prawns', 'Cook for 5 minutes']
            },
            'সিমের পকোড়া | Flat Bean Fritters': {
                ingredients: ['2 cups flat beans (chopped)', '1 cup gram flour', '1 tsp red chili powder', '1/2 tsp turmeric', '1 tsp cumin seeds', 'Oil for frying', 'Salt to taste'],
                instructions: ['Mix gram flour with spices', 'Add chopped beans', 'Add water to make thick batter', 'Heat oil for frying', 'Drop spoonfuls of batter', 'Fry until golden brown', 'Serve hot']
            },
            'নিরামিষ সোয়া চিল্লি | Vegetarian Soya Chilli': {
                ingredients: ['1 cup soya chunks', '1 bell pepper', '1 onion', '2 tbsp soy sauce', '1 tbsp chili sauce', '1 tsp ginger-garlic paste', '2 tbsp oil', 'Spring onions'],
                instructions: ['Soak soya chunks in hot water', 'Heat oil, add ginger-garlic paste', 'Add onions and bell pepper', 'Add squeezed soya chunks', 'Add sauces and toss', 'Garnish with spring onions']
            },
            // Rohu Fish Curry recipe removed
            
            'ক্রিসমাস কেক | Christmas Cake': {
                ingredients: ['2 cups flour', '1 cup butter', '1 cup sugar', '4 eggs', '1 cup mixed fruits', '1/2 cup nuts', '1 tsp baking powder', '1 tsp vanilla essence'],
                instructions: ['Cream butter and sugar', 'Add eggs one by one', 'Add flour and baking powder', 'Fold in fruits and nuts', 'Add vanilla essence', 'Bake at 180°C for 45 minutes', 'Cool and serve']
            },
            'মটর পনির | Matar Paneer Recipe': {
                ingredients: ['200g paneer (cubed)', '1 cup green peas', '2 onions (chopped)', '2 tomatoes (chopped)', '1 tbsp ginger-garlic paste', '1 tsp garam masala', '3 tbsp oil', 'Cream for garnish'],
                instructions: ['Heat oil, lightly fry paneer', 'Add onions and sauté', 'Add ginger-garlic paste', 'Add tomatoes and cook', 'Add peas and spices', 'Add paneer back', 'Garnish with cream']
            },
            'কালোজাম | Kala Jamun': {
                ingredients: ['1 cup milk powder', '1/4 cup flour', '1/4 cup milk', '1 cup sugar', '2 cups water', '1/4 tsp cardamom powder', 'Oil for frying'],
                instructions: ['Mix milk powder, flour and milk', 'Make small balls', 'Deep fry until dark brown', 'Make sugar syrup with cardamom', 'Add fried balls to syrup', 'Soak for 2 hours', 'Serve chilled']
            }
        };
        
        return recipes[title] || {
            ingredients: ['Recipe details coming soon'],
            instructions: ['Full instructions will be available shortly']
        };
    }
    
    createModal() {
        let modal = document.querySelector('.recipe-modal');
        if (!modal) {
            modal = Utils.createModal('recipe-modal');
            modal.innerHTML = Utils.createModalStructure('Recipe Details', '');
            document.body.appendChild(modal);
            
            const closeHandler = (e) => {
                if (e.target === modal || e.target.closest('.recipe-modal-close')) {
                    Utils.closeModal(modal);
                }
            };
            
            modal.addEventListener('click', closeHandler);
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    Utils.closeModal(modal);
                }
            });
        }
        return modal;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RecipesManager();
    new RecipeCardInteractions();
});