import fs from "fs";
import { Command } from "commander";
import chalk from "chalk";
import figlet from "figlet";

const program = new Command();
const todosFile = "todos.json";

function readTodos() {
  try {
    const data = fs.readFileSync(todosFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeTodos(todos) {
  fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
}

console.log(
  chalk.green(figlet.textSync("Todo CLI", { horizontalLayout: "full" }))
);

program
  .command("add <todo>")
  .description("Add a new todo")
  .action((todo) => {
    const todos = readTodos();
    todos.push({ task: todo, done: false });
    writeTodos(todos);
    console.log(chalk.blue(`Added: "${todo}"`));
  });

program
  .command("delete <index>")
  .description("Delete a todo by index")
  .action((index) => {
    const todos = readTodos();
    if (index < 1 || index > todos.length) {
      console.log(chalk.red("Invalid index"));
    } else {
      const [deleted] = todos.splice(index - 1, 1);
      writeTodos(todos);
      console.log(chalk.yellow(`Deleted: "${deleted.task}"`));
    }
  });

program
  .command("done <index>")
  .description("Mark a todo as done by index")
  .action((index) => {
    const todos = readTodos();
    if (index < 1 || index > todos.length) {
      console.log(chalk.red("Invalid index"));
    } else {
      todos[index - 1].done = true;
      writeTodos(todos);
      console.log(chalk.green(`Marked as done: "${todos[index - 1].task}"`));
    }
  });

program
  .command("update <index> <newTodo>")
  .description("Update a todo by index")
  .action((index, newTodo) => {
    const todos = readTodos();
    if (index < 1 || index > todos.length) {
      console.log(chalk.red("Invalid index"));
    } else {
      const oldTodo = todos[index - 1].task;
      todos[index - 1].task = newTodo;
      writeTodos(todos);
      console.log(chalk.green(`Updated: "${oldTodo}" to "${newTodo}"`));
    }
  });

program
  .command("list")
  .description("List all todos")
  .action(() => {
    console.log(chalk.cyan("Available commands:"));
    program.commands.forEach((cmd) => {
      console.log(`${chalk.yellow(cmd.name())}: ${cmd.description()}`);
    });

    const todos = readTodos();
    if (todos.length === 0) {
      console.log(chalk.magenta("\nNo todos found."));
    } else {
      console.log(chalk.cyan("\nYour todos:"));
      todos.forEach((todo, index) => {
        const status = todo.done
          ? chalk.green("[done]")
          : chalk.red("[not done]");
        console.log(`${chalk.yellow(index + 1)}. ${todo.task} ${status}`);
      });
    }
  });

program.parse(process.argv);
