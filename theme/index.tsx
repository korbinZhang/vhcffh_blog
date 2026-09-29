import { usePage } from '@rspress/core/runtime';
import {
  getCustomMDXComponent as BasicGetCustomMDXComponent,
  Layout as BasicLayout,
} from '@rspress/core/theme-original';
import {
  LlmsContainer,
  LlmsCopyButton,
  LlmsViewOptions,
  type LlmsViewOptionsProps,
} from '@rspress/plugin-llms/runtime';
import { CardList, type CardProps } from './card';

function getCustomMDXComponent() {
  const { h1: H1, ...mdxComponents } = BasicGetCustomMDXComponent();
  const { page } = usePage();
  const options: LlmsViewOptionsProps = {
    options: [
      'markdownLink',
      'chatgpt',
      'claude',
    ],
  };

  const MyH1 = ({ ...props }) => {
    return (
      <>
        <H1 {...props} />
        {page.routePath.startsWith('/blog/2') && (
          <LlmsContainer>
            <LlmsCopyButton />
            <LlmsViewOptions {...options} />
          </LlmsContainer>
        )}
      </>
    );
  };

  return {
    ...mdxComponents,
    h1: MyH1,
  };
}

const Layout = () => {
  const { page } = usePage();

  if (page.routePath.startsWith('/blog')) {
    if (page.frontmatter.sidebar === undefined) {
      page.frontmatter.sidebar = false;
    }
    if (page.frontmatter.outline === undefined) {
      page.frontmatter.outline = false;
    }
  }
  if (page.routePath.startsWith('/project')) {
    if (page.frontmatter.sidebar === undefined) {
      page.frontmatter.sidebar = false;
    }
    if (page.frontmatter.outline === undefined) {
      page.frontmatter.outline = false;
    }
  }

  return <BasicLayout />;
};

export { getCustomMDXComponent };
export { Layout, CardList, type CardProps };
export * from '@rspress/core/theme-original';
