import { App, TFile, Notice } from "obsidian";
import {
  removeButton,
  removeSection,
  appendContent,
  prependContent,
  createNote,
} from "./utils";
import { Arguments } from "./types";

export const remove = (app: App, { name }: Arguments): void => {
  setTimeout(() => removeButton(app, name), 100);
};

export const replace = (app: App, { replace, name }: Arguments): void => {
  removeSection(app, replace, name);
};

export const template = async (
  app: App,
  { name, type, action }: Arguments
): Promise<void> => {
  console.log("template button");
  const templatesEnabled = app.internalPlugins.plugins.templates.enabled;
  //only run if templates plugin is enabled
  if (templatesEnabled) {
    const folder =
      app.internalPlugins.plugins.templates.instance.options.folder;
    const allFiles = app.vault.getFiles();
    const file: TFile = allFiles.filter(
      (file) => file.path === `${folder}/${action}.md`
    )[0];
    if (file) {
      const content = await app.vault.read(file);
      //prepend template above the button
      if (type.includes("prepend")) {
        prependContent(app, content, name);
        setTimeout(
          () =>
            app.commands.executeCommandById(
              "templater-obsidian:replace-in-file-templater"
            ),
          100
        );
      }
      // append template below the button
      if (type.includes("append")) {
        appendContent(app, content, name);
        setTimeout(
          () =>
            app.commands.executeCommandById(
              "templater-obsidian:replace-in-file-templater"
            ),
          100
        );
      }
      if (type.includes("note")) {
        createNote(app, content, type);
      }
    } else {
      new Notice(
        `Couldn't find the specified template, please check and try again`,
        2000
      );
    }
  } else {
    new Notice("You need to have the Templates plugin enabled", 2000);
  }
};

export const link = ({ action }: Arguments): void => {
  const link = action.trim();
  window.open(link);
};

export const command = (app: App, { action }: Arguments): void => {
  const allCommands = app.commands.listCommands();
  const command = allCommands.filter(
    (command) => command.name.toUpperCase() === action.toUpperCase().trim()
  )[0];
  app.commands.executeCommandById(command.id);
};
