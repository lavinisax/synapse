/* ═══════════════════════════════════════════════════════════════════════════
   SYNAPSE - SAT Question Bank
   Mock questions for demonstration
   ═══════════════════════════════════════════════════════════════════════════ */

const QUESTIONS = {
    sat: {
        math: [
            {
                id: 'm001',
                topic: 'Algebra',
                difficulty: 2,
                question: 'If 3x + 7 = 22, what is the value of x?',
                options: ['3', '5', '7', '15'],
                correct: 1,
                explanation: 'Subtract 7 from both sides: 3x = 15. Then divide by 3: x = 5.'
            },
            {
                id: 'm002',
                topic: 'Algebra',
                difficulty: 3,
                question: 'If 2(x - 3) = 4x + 10, what is the value of x?',
                options: ['-8', '-4', '4', '8'],
                correct: 0,
                explanation: 'First distribute: 2x - 6 = 4x + 10. Subtract 2x from both sides: -6 = 2x + 10. Subtract 10: -16 = 2x. Divide by 2: x = -8.'
            },
            {
                id: 'm003',
                topic: 'Geometry',
                difficulty: 2,
                question: 'A circle has a radius of 5. What is its area in terms of π?',
                options: ['10π', '25π', '50π', '100π'],
                correct: 1,
                explanation: 'Area of a circle = πr². With r = 5: A = π(5)² = 25π.'
            },
            {
                id: 'm004',
                topic: 'Data Analysis',
                difficulty: 3,
                question: 'The mean of 5 numbers is 12. If four of the numbers are 10, 11, 13, and 14, what is the fifth number?',
                options: ['10', '11', '12', '13'],
                correct: 2,
                explanation: 'Mean × count = sum. So 12 × 5 = 60. The sum of the four known numbers is 10 + 11 + 13 + 14 = 48. The fifth number is 60 - 48 = 12.'
            },
            {
                id: 'm005',
                topic: 'Advanced Math',
                difficulty: 4,
                question: 'What is the sum of the solutions to the equation x² - 5x + 6 = 0?',
                options: ['2', '3', '5', '6'],
                correct: 2,
                explanation: 'Factor: (x - 2)(x - 3) = 0. Solutions are x = 2 and x = 3. Sum = 2 + 3 = 5. Alternatively, for ax² + bx + c = 0, sum of roots = -b/a = 5/1 = 5.'
            },
            {
                id: 'm006',
                topic: 'Algebra',
                difficulty: 2,
                question: 'If f(x) = 2x + 3, what is f(4)?',
                options: ['8', '11', '14', '20'],
                correct: 1,
                explanation: 'Substitute x = 4: f(4) = 2(4) + 3 = 8 + 3 = 11.'
            },
            {
                id: 'm007',
                topic: 'Geometry',
                difficulty: 3,
                question: 'In a right triangle, if one leg is 3 and the hypotenuse is 5, what is the length of the other leg?',
                options: ['2', '4', '6', '8'],
                correct: 1,
                explanation: 'Using the Pythagorean theorem: a² + b² = c². So 3² + b² = 5². 9 + b² = 25. b² = 16. b = 4.'
            },
            {
                id: 'm008',
                topic: 'Algebra',
                difficulty: 4,
                question: 'If 2^(x+1) = 32, what is the value of x?',
                options: ['3', '4', '5', '6'],
                correct: 1,
                explanation: '32 = 2^5. So 2^(x+1) = 2^5. Therefore x + 1 = 5, and x = 4.'
            },
            {
                id: 'm009',
                topic: 'Data Analysis',
                difficulty: 2,
                question: 'If a store offers 20% off a $50 item, what is the sale price?',
                options: ['$30', '$35', '$40', '$45'],
                correct: 2,
                explanation: '20% of $50 = 0.20 × 50 = $10. Sale price = $50 - $10 = $40.'
            },
            {
                id: 'm010',
                topic: 'Advanced Math',
                difficulty: 5,
                question: 'For what value of k does the equation x² + kx + 9 = 0 have exactly one solution?',
                options: ['±3', '±6', '±9', '±12'],
                correct: 1,
                explanation: 'For exactly one solution, the discriminant must equal zero: b² - 4ac = 0. So k² - 4(1)(9) = 0. k² = 36. k = ±6.'
            }
        ],
        reading: [
            {
                id: 'r001',
                topic: 'Main Idea',
                difficulty: 2,
                passage: 'Recent studies have shown that regular exercise not only improves physical health but also has significant benefits for mental well-being. Researchers found that people who exercised at least three times a week reported lower levels of stress and anxiety compared to those who were sedentary.',
                question: 'What is the main idea of this passage?',
                options: [
                    'Exercise is only good for physical health',
                    'Exercise benefits both physical and mental health',
                    'Sedentary people are always stressed',
                    'You must exercise daily to see benefits'
                ],
                correct: 1,
                explanation: 'The passage explicitly states that exercise improves both "physical health" and "mental well-being," with evidence about reduced stress and anxiety.'
            },
            {
                id: 'r002',
                topic: 'Inference',
                difficulty: 3,
                passage: 'The old library stood on the corner of Main Street, its windows dark and dusty. For decades, it had been the intellectual heart of the community, but now weeds grew through the cracks in the steps, and the once-proud sign hung at an angle.',
                question: 'What can be inferred about the library?',
                options: [
                    'It was recently built',
                    'It is currently thriving',
                    'It has fallen into disuse',
                    'It is being renovated'
                ],
                correct: 2,
                explanation: 'The description of dark windows, dust, weeds, and a tilted sign all suggest neglect and abandonment, indicating the library has fallen into disuse.'
            },
            {
                id: 'r003',
                topic: 'Vocabulary in Context',
                difficulty: 2,
                passage: 'The scientist\'s hypothesis was initially met with skepticism, but as more data accumulated, even her harshest critics had to acknowledge the validity of her findings.',
                question: 'In this context, "skepticism" most nearly means:',
                options: [
                    'Enthusiasm',
                    'Doubt',
                    'Anger',
                    'Support'
                ],
                correct: 1,
                explanation: 'Skepticism means doubt or disbelief. The contrast with later "acknowledgment" of validity confirms this meaning.'
            },
            {
                id: 'r004',
                topic: 'Author\'s Purpose',
                difficulty: 3,
                passage: 'While many argue that social media has connected the world, we must consider its shadow side. Studies link heavy social media use to increased rates of depression, particularly among teenagers. We cannot ignore this data in our rush to celebrate connectivity.',
                question: 'What is the author\'s primary purpose?',
                options: [
                    'To celebrate social media\'s benefits',
                    'To argue that social media should be banned',
                    'To present a balanced critique of social media',
                    'To explain how social media works'
                ],
                correct: 2,
                explanation: 'The author acknowledges social media\'s benefits ("connected the world") while presenting concerns about its negative effects, indicating a balanced critique.'
            },
            {
                id: 'r005',
                topic: 'Evidence',
                difficulty: 4,
                passage: 'The coral reefs, often called the "rainforests of the sea," support approximately 25% of all marine species despite covering less than 1% of the ocean floor. However, rising ocean temperatures have triggered mass bleaching events, threatening this delicate ecosystem.',
                question: 'Which claim is directly supported by evidence in the passage?',
                options: [
                    'Coral reefs are more important than rainforests',
                    'Coral reefs support a disproportionately large number of species',
                    'All marine species depend on coral reefs',
                    'Ocean temperatures are rising faster than predicted'
                ],
                correct: 1,
                explanation: 'The passage provides specific data: 25% of species on less than 1% of ocean floor. This directly supports the claim about disproportionate species support.'
            }
        ],
        writing: [
            {
                id: 'w001',
                topic: 'Grammar',
                difficulty: 2,
                question: 'Select the correct version: "Neither the students nor the teacher ____ ready for the surprise inspection."',
                options: ['was', 'were', 'are', 'been'],
                correct: 0,
                explanation: 'With "neither...nor" constructions, the verb agrees with the subject closest to it. "Teacher" is singular, so use "was."'
            },
            {
                id: 'w002',
                topic: 'Punctuation',
                difficulty: 2,
                question: 'Which sentence uses the semicolon correctly?',
                options: [
                    'I love pizza; and pasta.',
                    'I love pizza; however, I am allergic to cheese.',
                    'I love; pizza, pasta, and salad.',
                    'I love pizza; pasta; and salad.'
                ],
                correct: 1,
                explanation: 'A semicolon correctly joins two independent clauses, especially when followed by a conjunctive adverb like "however."'
            },
            {
                id: 'w003',
                topic: 'Sentence Structure',
                difficulty: 3,
                question: 'Which revision eliminates the dangling modifier? Original: "Walking through the park, the flowers were beautiful."',
                options: [
                    'Walking through the park, the beautiful flowers.',
                    'The flowers were beautiful, walking through the park.',
                    'Walking through the park, I found the flowers beautiful.',
                    'The flowers walking through the park were beautiful.'
                ],
                correct: 2,
                explanation: 'The original sentence implies the flowers were walking. By adding "I" as the subject, it\'s clear who was walking through the park.'
            },
            {
                id: 'w004',
                topic: 'Word Choice',
                difficulty: 2,
                question: 'Select the most precise word: "The experiment had a ____ impact on our understanding of the phenomenon."',
                options: ['big', 'significant', 'really large', 'super important'],
                correct: 1,
                explanation: '"Significant" is the most precise and formal word choice for academic writing, conveying importance without being vague or informal.'
            },
            {
                id: 'w005',
                topic: 'Transitions',
                difficulty: 3,
                question: 'Which transition best connects these sentences? "The company reported record profits. ____, they announced layoffs."',
                options: ['Consequently', 'Nevertheless', 'Furthermore', 'Similarly'],
                correct: 1,
                explanation: '"Nevertheless" indicates contrast between two seemingly contradictory ideas (high profits vs. layoffs), making it the best choice.'
            }
        ]
    }
};

// Question selection helpers
function getRandomQuestions(category, count = 5) {
    const available = QUESTIONS.sat[category] || [];
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

function getQuestionsByDifficulty(category, difficulty) {
    const available = QUESTIONS.sat[category] || [];
    return available.filter(q => q.difficulty === difficulty);
}

function getQuestionById(id) {
    for (const category of Object.values(QUESTIONS.sat)) {
        const found = category.find(q => q.id === id);
        if (found) return found;
    }
    return null;
}

// Export
window.QUESTIONS = QUESTIONS;
window.getRandomQuestions = getRandomQuestions;
window.getQuestionsByDifficulty = getQuestionsByDifficulty;
window.getQuestionById = getQuestionById;
