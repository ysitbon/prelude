/*eslint-env node,mocha*/
import {map}                    from "@prelude/trait-functor";
import {flatMap}                from "@prelude/trait-monad";
import {Identity}               from "@prelude/data-identity";
import {getReaderT, runReaderT} from "../src/index.js";
import assert                   from "assert";

describe("@prelude/data-reader-transformer (example)", () => {
  const {ask} = getReaderT(Identity);

  it("example", () => {
    /** @typedef {string} Email */
    /** @typedef {string} Html */
    /**
     * Writes a `div` html element.
     *
     * @param {Html[]} children
     * @return {Html}
     */
    const div = children => `<div>${children.join("")}</div>`;

    /**
     * Writes an `h1` html element.
     *
     * @param {Html[]} children
     * @return {Html}
     */
    const h1 = children => `<h1>${children.join("")}</h1>`;

    /**
     * Writes a `<p>` html element.
     *
     * @param {Html[]} children
     * @return {Html}
     */
    const p = children => `<p>${children.join("")}</p>`;

    /**
     * Writes the notification widget html.
     *
     * @type {ReaderT<Email, Identity<Html>>}
     */
    const widget = ask |> map(email => div([
      p([`Hey ${email}, we've got a great offer for you!`])
    ]));

    /**
     * Writes the html for one article which also contains a notification widget.
     *
     * @type {ReaderT<Email, Identity<Html>>}
     */
    const article = widget |> map(widgetHtml => div([
      p(["this is an article"]),
      widgetHtml
    ]));

    /**
     * Writes the application top navigation html.
     *
     * @type {ReaderT<Email, Identity<Html>>}
     */
    const right = article |> map(articleHtml => div([articleHtml]));

    /**
     * Writes the application top navigation html.
     *
     * @type {Html}
     */
    const left = div([p(["this is the left side"])]);

    /**
     * Writes the application top navigation html.
     *
     * @type {Html}
     */
    const topNav = div([h1(["OurSite.com"])]);

    /**
     * Writes the application top navigation html.
     *
     * @type {ReaderT<Email, Identity<Html>>}
     */
    const content = ask |> flatMap(email => right
        |> map(rightHtml => div([
        h1([`Custom Content for ${email}`]),
        left,
        rightHtml
      ]))
    );

    /**
     * Writes the page html which contains the `topNav` and `content`.
     *
     * @type {ReaderT<Email, Identity<Html>>}
     */
    const page = content |> map(contentHtml => div([topNav, contentHtml]));

    /**
     * Writes the application view html.
     *
     * @type {ReaderT<Email, Identity<Html>>}
     */
    const view = page |> map(pageHtml => div([pageHtml]));

    /**
     * Main entry point.
     *
     * @param {Email} email
     * @return {Identity<Html>}
     */
    const app = runReaderT(view);

    // Expected Html output
    const expected = `
      <div>
        <div>
          <div>
            <h1>OurSite.com</h1>
          </div>
          <div>
            <h1>Custom Content for email@dot.com</h1>
            <div>
              <p>this is the left side</p>
            </div>
            <div>
              <div>
                <p>this is an article</p>
                <div>
                  <p>Hey email@dot.com, we've got a great offer for you!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    assert.deepStrictEqual(
      Identity(expected.replace(/([\n][\s]+)/g, "")),
      app("email@dot.com")
    );
  });
});
