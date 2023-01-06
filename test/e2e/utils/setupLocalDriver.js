import { Builder } from 'selenium-webdriver';

globalThis.buildDriver = () => new Builder().forBrowser('chrome').build();
