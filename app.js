/* ========================================
   PostPal Academy — App JavaScript
   ======================================== */

// ========================================
// State Management (localStorage)
// ========================================

const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`postpal_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(`postpal_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('localStorage not available');
        }
    },
    
    // Member mode
    isMember() {
        return this.get('member_mode', false);
    },
    
    setMemberMode(value) {
        this.set('member_mode', value);
    },
    
    // Progress
    getCompletedLessons() {
        return this.get('completed_lessons', []);
    },
    
    completeLesson(lessonId) {
        const completed = this.getCompletedLessons();
        if (!completed.includes(lessonId)) {
            completed.push(lessonId);
            this.set('completed_lessons', completed);
        }
        return completed;
    },
    
    isLessonCompleted(lessonId) {
        return this.getCompletedLessons().includes(lessonId);
    },
    
    // Streak
    getStreak() {
        const data = this.get('streak_data', { count: 0, lastDate: null });
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (data.lastDate === today) {
            return data.count;
        } else if (data.lastDate === yesterday) {
            return data.count;
        } else {
            return 0;
        }
    },
    
    incrementStreak() {
        const today = new Date().toDateString();
        const data = this.get('streak_data', { count: 0, lastDate: null });
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (data.lastDate === today) {
            // Already logged today
            return data.count;
        } else if (data.lastDate === yesterday || data.lastDate === null) {
            // Continue streak
            data.count++;
            data.lastDate = today;
        } else {
            // Streak broken, start fresh
            data.count = 1;
            data.lastDate = today;
        }
        
        this.set('streak_data', data);
        return data.count;
    },
    
    // Notes
    getNotes(lessonId) {
        const notes = this.get('lesson_notes', {});
        return notes[lessonId] || '';
    },
    
    saveNotes(lessonId, content) {
        const notes = this.get('lesson_notes', {});
        notes[lessonId] = content;
        this.set('lesson_notes', notes);
    }
};

// ========================================
// Navigation
// ========================================

function initNav() {
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.nav-mobile');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
        
        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
            });
        });
    }
}

// ========================================
// Accordion
// ========================================

function initAccordion() {
    const accordions = document.querySelectorAll('.accordion-item');
    
    accordions.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                // Close others (optional - remove for multi-open)
                accordions.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('open');
                    }
                });
                item.classList.toggle('open');
            });
        }
    });
}

// ========================================
// Curriculum Modules
// ========================================

function initCurriculumModules() {
    const modules = document.querySelectorAll('.curriculum-module');
    
    modules.forEach(module => {
        const header = module.querySelector('.module-header');
        if (header) {
            header.addEventListener('click', () => {
                module.classList.toggle('open');
            });
        }
    });
}

// ========================================
// Member Mode Toggle
// ========================================

function initMemberToggle() {
    const toggle = document.querySelector('.toggle-switch');
    const label = document.querySelector('.member-toggle span:last-child');
    
    if (toggle) {
        // Set initial state
        const isMember = Storage.isMember();
        toggle.classList.toggle('on', isMember);
        if (label) {
            label.textContent = isMember ? 'On' : 'Off';
        }
        
        toggle.addEventListener('click', () => {
            const newState = !Storage.isMember();
            Storage.setMemberMode(newState);
            toggle.classList.toggle('on', newState);
            if (label) {
                label.textContent = newState ? 'On' : 'Off';
            }
            
            // Update lesson states
            updateLessonStates();
            updateLockedState();
        });
    }
}

// ========================================
// Lesson States
// ========================================

function updateLessonStates() {
    const isMember = Storage.isMember();
    const lessons = document.querySelectorAll('.lesson-item');
    
    lessons.forEach(lesson => {
        const lessonId = lesson.dataset.lesson;
        const isCompleted = Storage.isLessonCompleted(lessonId);
        
        lesson.classList.remove('locked', 'unlocked', 'completed');
        
        if (isMember) {
            lesson.classList.add('unlocked');
            if (isCompleted) {
                lesson.classList.add('completed');
                const status = lesson.querySelector('.lesson-status');
                if (status) status.textContent = '✓';
            }
        } else {
            lesson.classList.add('locked');
        }
    });
}

function updateLockedState() {
    const isMember = Storage.isMember();
    const lockedOverlay = document.querySelector('.curriculum-locked');
    
    if (lockedOverlay) {
        lockedOverlay.style.display = isMember ? 'none' : 'block';
    }
}

// ========================================
// Progress Widget
// ========================================

function updateProgressWidget() {
    const streakEl = document.getElementById('streak-count');
    const completedEl = document.getElementById('completed-count');
    
    if (streakEl) {
        streakEl.textContent = Storage.getStreak();
    }
    
    if (completedEl) {
        completedEl.textContent = Storage.getCompletedLessons().length;
    }
}

// ========================================
// Lesson Modal
// ========================================

let currentLessonId = null;

function initLessonModal() {
    const modal = document.getElementById('lesson-modal');
    const closeBtn = modal?.querySelector('.modal-close');
    const overlay = modal;
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }
    
    // Lesson clicks
    document.querySelectorAll('.lesson-item').forEach(lesson => {
        lesson.addEventListener('click', () => {
            if (lesson.classList.contains('unlocked')) {
                openLesson(lesson.dataset.lesson, lesson.dataset.title);
            }
        });
    });
    
    // Save notes on input
    const notesTextarea = document.getElementById('lesson-notes');
    if (notesTextarea) {
        notesTextarea.addEventListener('input', () => {
            if (currentLessonId) {
                Storage.saveNotes(currentLessonId, notesTextarea.value);
            }
        });
    }
    
    // Mark complete button
    const completeBtn = document.getElementById('mark-complete-btn');
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            if (currentLessonId) {
                Storage.completeLesson(currentLessonId);
                Storage.incrementStreak();
                updateLessonStates();
                updateProgressWidget();
                closeModal();
            }
        });
    }
}

function openLesson(lessonId, title) {
    const modal = document.getElementById('lesson-modal');
    const titleEl = document.getElementById('modal-lesson-title');
    const notesTextarea = document.getElementById('lesson-notes');
    
    if (!modal) return;
    
    currentLessonId = lessonId;
    
    if (titleEl) {
        titleEl.textContent = title || 'Lesson';
    }
    
    if (notesTextarea) {
        notesTextarea.value = Storage.getNotes(lessonId);
    }
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('lesson-modal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        currentLessonId = null;
    }
}

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initAccordion();
    initCurriculumModules();
    initMemberToggle();
    initLessonModal();
    updateLessonStates();
    updateLockedState();
    updateProgressWidget();
});

// Escape key closes modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
