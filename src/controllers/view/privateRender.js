const { Op } = require("sequelize");
const axios = require("axios");
const getApiQuestions = require("../../fetchers/open-trivia");

const { Quiz, User, Category } = require("../../models");

const renderDashboardPage = (req, res) => {
  res.render("dashboard");
};

const renderMainQuizPage = async (req, res) => {
  try {
    const allQuizzes = await Quiz.findAll({
      include: [
        // In the JSON it returns it will include username of the creator of the quiz
        { model: User, attributes: ["username"] },
        { model: Category, attributes: ["category_name"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    // Getting a plain version of the JSON data (just data we inputted)
    const formattedQuizzes = allQuizzes
      .map((quiz) => quiz.get({ plain: true }))
      .slice(0, 8);

    res.render("quizzes", { formattedQuizzes });
  } catch (err) {
    console.error(err);
  }
};

const renderCreateQuizPage = async (req, res) => {
  res.render("create-quiz");
};

const renderCreateQuestionPage = async (req, res) => {
  // const apiQuestions = await getApiQuestions();
  const response = await axios.get(
    "https://opentdb.com/api.php?amount=10&category=25"
  );
  const { data } = response;
  const generatedQuizQuestions = data.results;

  console.log(generatedQuizQuestions);
  res.render("create-quiz-questions", { generatedQuizQuestions });
};

const renderQuizPageById = async (req, res) => {
  try {
    const { id } = req.params;

    const getQuiz = await Quiz.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Category,
        },
      ],
    });

    const formattedQuiz = getQuiz.get({ plain: true });

    res.render("individual-quiz", { formattedQuiz });
  } catch (error) {
    console.log(error.message);
  }
};

const renderSearchedQuizzes = async (req, res) => {
  try {
    const { title, category_id } = req.query;

    let searchTerm;
    let columnName;

    if (title) {
      searchTerm = title;
      columnName = "title";
    } else {
      searchTerm = category_id;
      columnName = "category_id";
    }

    const quizzes = await Quiz.findAll({
      where: {
        [columnName]: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      include: [
        { model: User, attributes: ["username"] },
        { model: Category, attributes: ["category_name"] },
      ],
    });

    const formattedQuizzes = quizzes.map((quiz) => quiz.get({ plain: true }));

    res.render("quizzes", { formattedQuizzes });
  } catch (err) {
    console.error(err);
  }
};
const renderGenerateQuiz = async (req, res) => {
  try {
    const { title, category, difficulty, type } = req.query;
    const params = { category, difficulty, type, amount: 10 };
    const apiQuestions = await getApiQuestions(params);
    console.log(apiQuestions);
    res.send("Generate Quiz");
  } catch (error) {}
};

module.exports = {
  renderDashboardPage,
  renderMainQuizPage,
  renderQuizPageById,
  renderCreateQuizPage,
  renderCreateQuestionPage,
  renderSearchedQuizzes,
  renderGenerateQuiz,
};
