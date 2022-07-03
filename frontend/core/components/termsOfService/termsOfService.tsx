import React from "react"
import "./termsOfService.css"
import { storeContext } from "../../App"
import { FunctionComponent, useContext, } from "react"
import MainState from "../../mobX/AllState"
import { observer } from "mobx-react-lite"


const TermsOfService: FunctionComponent = observer(({}: any) => {
    const state = useContext<MainState>(storeContext)


    return (
        <div className="termsContainer">
        <div>
            <h1>Terms of Use</h1>
        </div>
        <div>
            <section>
            <h3>Introduction</h3>
            <p>
                The current Terms and Conditions govern your use of this website. By visiting or
                otherwise using this  website, you automatically accept these Terms and Conditions in full.
                In case you disagree with these Terms and Conditions or any part thereof, you must not
                use this website.
                </p>
                <p>
                You must be at least 14 full years of age to use this website. By using this website and by
                    agreeing to these terms and conditions, you warrant and represent that you are at
                    least 14 years of age.
                </p>
                <p>
                This website utilizes cookies for storing user information.
                By using this website and agreeing to these terms and conditions, you consent to our use
                    of cookies in accordance with the terms of Egor Sozonov's privacy policy.
                </p>

            </section>

            <section>
                <h3>License to use this website</h3>
                <p>
                Unless otherwise stated, Egor Sozonov owns the intellectual property rights
                in the website and material on the website.
                Subject to the license below, all these intellectual property rights are reserved.
                </p>

                <p>
                You may view, download for caching purposes only, and print pages or other content from the
                    website for your own personal use, subject to the restrictions set out below and
                    elsewhere in these terms and conditions.
                </p>
                <p>
                You must not:
                </p>

                <ul>
                    <li>republish material from this website (including republication on another website);</li>
                    <li>reproduce, duplicate, copy or otherwise exploit material on this website for a commercial purpose;</li>
                    <li>sell, rent or sub-license material from the website;</li>
                    <li>edit or otherwise modify any material on the website; or</li>
                    <li>redistribute material from this website (except for content specifically and
                        expressly made available for redistribution).</li>

                </ul>
            </section>

            <section>
                <h3>Acceptable use</h3>
                <p>
                You must not use this website in any way that causes, or may potentially cause,
                    damage to the website
                    or impairment of the availability or accessibility of the website; or in any way which
                    is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful,
                    illegal, fraudulent or harmful purpose or activity.
                </p>
                <p>
                You must not use this website to copy, store, host, transmit, send, use, publish or
                    distribute any material which consists of (or is linked to) any spyware, computer virus,
                    Trojan horse, worm, keystroke logger, rootkit or any other malicious computer software.
                </p>
                <p>
                You must not perform any systematic or automated data collection activities (including
                    without limitation scraping, data mining, data extraction and data harvesting) on or
                    in relation to this website without Egor Sozonov's express written consent.
                </p>

                <p>
                You must not use this website for transmission or sending of unsolicited commercial
                    communications.
                </p>
                <p>
                You must not use this website for any purposes related to marketing without Egor Sozonov's
                    express written consent.
                </p>
                <p>
                    You must provide a hyperlink to, or a full address of any page of this website that you
                    reference elsewhere.
                </p>
            </section>

            <section>
                <h3>Warranty</h3>
                <p>
                    This website is provided “as is” without any representations or warranties, express
                    or implied. Egor Sozonov  makes no representations or warranties in relation to this
                    website or the information and materials provided on this website.
                </p>
                <p>
                    Without prejudice to the generality of the foregoing paragraph, Egor Sozonov does not
                    warrant that:
                </p>

                <ul>
                    <li>this website will be constantly available, or available ever at all; or
                    </li>
                    <li>the information on this website is complete, true, accurate or non-misleading.
                    </li>
                </ul>
                <p>Nothing on this website constitutes, or is meant to constitute, advice of any kind.
                   If you require advice in relation to any legal, financial or medical matter, you should
                   consult an appropriate professional.
                </p>

            </section>

            <section>
                <h3>User Content</h3>
                <p>
                In these terms and conditions, “your user content” means material (including without
                    limitation text, images, audio material, video material and audio-visual material) that
                    you submit to this website, for whatever purpose.
                </p>
                <p>
                You grant to Egor Sozonov a worldwide, irrevocable, non-exclusive, royalty-free
                license to use, reproduce, adapt, publish, translate and distribute your user content
                in any existing or future media.
                You also grant to Egor Sozonov the right to sub-license these rights, and the right to
                bring an action for infringement of these rights.
                </p>
                <p>
                Your user content must not be illicit, illegal or unlawful, must not infringe any third
                    party's legal rights, and must not be capable of giving rise to legal action whether
                    against you or Egor Sozonov or a third party (in each case under any applicable law).
                </p>
                <p>
                You must not submit any user content to the website that is or has ever been the subject of
                    any legal proceedings or other similar complaint.
                </p>
                <p>
                Egor Sozonov reserves the right to remove any material submitted to this website,
                    or stored on Egor Sozonov's servers, or hosted or published upon this website.
                </p>
                <p>
                Notwithstanding Egor Sozonov's rights under these terms and conditions in relation to user
                content, Egor Sozonov does not undertake to monitor the submission of such content to, or
                    the publication of such content on, this website.
                </p>
            </section>



            <section>

                <h3>Liability Limitations</h3>
                <p>
            Egor Sozonov will not be liable to you (whether under the law of contact, the law of torts or
                    otherwise) in relation to the contents of, or use of, or otherwise in connection with,
                    this website:
                </p>
                <ul>
                    <li>
            to the extent that the website is provided free-of-charge, for any direct loss;
                    </li>
                    <li>
            for any indirect, special or consequential loss; or
                    </li>
                    <li>
            for any business losses, loss of revenue, income, profits or anticipated savings, loss of
                        contracts or business relationships, loss of reputation or goodwill, or loss or
                        corruption of information or data.
                    </li>
                </ul>
                <p>
            These limitations of liability apply even if Egor Sozonov has been expressly advised of the
                    potential loss.
                </p>
            </section>
            <section>
                <h3>Exceptions</h3>
                <p>
            Nothing in this website disclaimer will exclude or limit any warranty implied by law that it
                    would be unlawful to exclude or limit; and nothing in this website disclaimer will
                    exclude or limit Egor Sozonov's liability in respect of any:
                </p>
                <ul>
                    <li>
                        death or personal injury caused by Egor Sozonov's negligence;
                    </li>
                    <li>
                        fraud or fraudulent misrepresentation on the part of Egor Sozonov's; or
                    </li>
                    <li>
                        matter which it would be illegal or unlawful for Egor Sozonov to exclude or limit,
                        or to attempt or purport to exclude or limit, its liability.
                    </li>
                </ul>
            </section>
            <section>
                <h3>Reasonableness</h3>

                <p>
                    By using this website, you agree that the exclusions and limitations of liability set
                    out in this website disclaimer are reasonable.
                </p>
                <p>
                    If you do not think they are reasonable, then you must not use this website.
                </p>
            </section>


            <section>
                <h3>Unenforceable provisions</h3>

                <p>
            If any provision of this website disclaimer is, or is found to be, unenforceable under
                    applicable law, that will not affect the enforceability of the other provisions of this
                    website disclaimer.
                </p>
            </section>

            <section>
                <h3>Indemnity</h3>

                <p>
                You hereby indemnify Egor Sozonov and undertake to keep Egor Sozonov indemnified against any
                losses, damages, costs, liabilities and expenses (including without limitation legal
                expenses and any amounts paid by Egor Sozonov to a third party in settlement of a claim
                or dispute on the advice of [NAME'S] legal advisers) incurred or suffered by Egor
                Sozonov arising out of any breach by you of any provision of these terms and conditions,
                or arising out of any claim that you have breached any provision of these terms and
                conditions.
                </p>
            </section>


            <section>
                <h3>Breaches of these terms and conditions</h3>

                <p>
                    Without prejudice to Egor Sozonov's other rights under these terms and conditions, if you
                    breach these terms and conditions in any way, Egor Sozonov may take such action as
                    Egor Sozonov deems
                    appropriate to deal with the breach, including suspending your access to the website,
                    prohibiting you from accessing the website, blocking computers using your IP address
                    from accessing the website, contacting your internet service provider to request that
                    they block your access to the website and/or bringing court proceedings against you.
                </p>
            </section>
            <section>
                <h3>Variation</h3>

                <p>
                    Egor Sozonov may revise these terms and conditions from time-to-time.  Revised terms and
                    conditions will apply to the use of this website from the date of the publication of
                    the revised terms and conditions on this website.  Please check this page regularly to
                    ensure you are familiar with the current version.
                </p>
            </section>
            <section>
            <h3>Assignment</h3>


            <p>You may not transfer, sub-contract or otherwise deal with your rights and/or obligations
                under these terms and conditions.</p>
            </section>
            <section>
                <h3>Severability</h3>
                <p>
                    Even if a provision of these terms and conditions is determined by any court or other
                    competent
                    authority to be unlawful and/or unenforceable, the other provisions will continue in
                    effect. If any unlawful and/or unenforceable provision would be lawful or enforceable
                    if part of it were deleted, that part will be deemed to be deleted, and the rest of the
                    provision will continue in effect.
                </p>
            </section>
            <section>
                <h3>
                    Entire agreement
                </h3>
                <p>
                    These terms and conditions constitute the entire agreement between you and Egor Sozonov in relation to
                    your use of this website, and supersede all previous agreements in respect of your use of this website.
                </p>
            </section>
            <section>
                <h3>Law and jurisdiction</h3>

                <p>
                    These terms and conditions will be governed by and construed in accordance with US law, and any
                    disputes relating to these terms and conditions will be subject to the exclusive jurisdiction
                    of the courts of the United States.
                </p>
            </section>

            <section>
                <h3>Egor Sozonov's details</h3>

                <p>
                    The full name of Egor Sozonov is Egor Andreevich Sozonov.
                </p>

                <p>
                    Egor Sozonov can be contacted by email.
                </p>
            </section>
        </div>
    </div>
    )
})


export default TermsOfService
