import { ApplicationCommandOptionData, ApplicationCommandSubCommandData, ApplicationCommandSubGroupData, Collection, PermissionFlags } from "discord.js"
import osu from "node-osu";
import { CommandManager } from "../classes/CommandManager";
import CooldownManager from "../classes/CooldownManager";
import { ClientMusicManager } from "../features/music/Model/ClientMusicManager";
import { ArgumentParseType, CommandManagerRejectReason, CommandOptionType } from "./enums";
import { CommandParserOptionFailWithChoicesResult, CommandParserOptionFailWithLimitResult, CommandParserOptionFailWithPureStatusResult, CommandParserOptionPassResult, PageSystemDescriptionOptions, PageSystemEmbedFieldOptions } from "./interfaces";

export type Intersect<T, U> = { [K in (keyof T & keyof U)]: T[K] | U[K] };

export type ValueOf<T> = T[keyof T];

export type CommandParserOptionResult = 
  | CommandParserOptionPassResult
  | CommandParserOptionFailWithPureStatusResult
  | CommandParserOptionFailWithChoicesResult
  | CommandParserOptionFailWithLimitResult

export type CommandParserPassResult = { args: unknown[] } & Omit<CommandParserOptionPassResult, 'arg'>;

export type CommandParserFailResult = { index: number } & Exclude<CommandParserOptionResult, CommandParserOptionPassResult>;

export type CommandParserResult = 
  | CommandParserPassResult
  | CommandParserFailResult

export type CommandManagerRejectInfo = 
  | { reason: CommandManagerRejectReason.Angry, args: [time: number] }
  | { reason: CommandManagerRejectReason.TwoFactorRequird, args: [] }
  | { reason: CommandManagerRejectReason.BotMissingPermission, args: [missings: (keyof PermissionFlags)[]] }
  | { reason: CommandManagerRejectReason.UserMissingPermission, args: [missings: (keyof PermissionFlags)[]] }
  | { reason: CommandManagerRejectReason.InCooldown, args: [time: number] }
  | { reason: CommandManagerRejectReason.IllegalArgument, args: [commandOptions: HZCommandOptionData[], result: CommandParserFailResult] };

export type HZCommandOptionData = (Exclude<ApplicationCommandOptionData,
  | ApplicationCommandSubCommandData
  | ApplicationCommandSubGroupData
> & { parseAs?: CommandOptionType, repeat?: boolean });

export type ArgumentParseMethod = 
  | { type: ArgumentParseType.None }
  | { type: ArgumentParseType.Split, separator: string }
  | { type: ArgumentParseType.Quote, quotes: [string, string] }
  | { type: ArgumentParseType.Custom, func(s: string): string[] }

export type AutocompleteReturnType = { [key: string]: { name: string, devOnly?: boolean }[] };

export type PageSystemOptions = PageSystemDescriptionOptions | PageSystemEmbedFieldOptions;

export type ThrowBallType = "棒球" | "保齡球" | "乒乓球" | "巧克力球";


declare module "discord.js" {
  interface BaseChannel {
    isTestChannel: () => boolean;
  }

  interface Client {
    autocomplete: Collection<string, AutocompleteReturnType>;
    buttons: Collection<string, (interaction: ButtonInteraction<"cached">) => Promise<void>>;
    commands: CommandManager;
    cooldown: CooldownManager;
    music: ClientMusicManager;

    devMode: boolean;

    angryList: Collection<string, number>;
    isAngryAt(userId: string): Promise<number>;

    blockedUsers: Set<string>;
    block(userId: string): void;
    unblock(userId: string): void;

    bugHook: WebhookClient;
    suggestHook: WebhookClient;
    replyHook: WebhookClient;

    osuApi: osu.Api;
  }

  interface EmbedBuilder {
    setHiZolloColor: () => EmbedBuilder;
  }

  interface User {
    blocked: boolean;
  }
}