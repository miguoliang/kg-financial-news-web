import React, { PropsWithChildren, Suspense } from "react";
import classNames from "classnames";
import { Container } from "components/shared";
import {
  PAGE_CONTAINER_GUTTER_X,
  PAGE_CONTAINER_GUTTER_Y,
} from "constants/theme.constant";
import Footer from "components/template/Footer";

const CustomHeader = ({ header: Header }: { header: any }) => {
  return <Header />;
};

export type PageContainerProps = Partial<
  PropsWithChildren<{
    pageContainerType: "default" | "gutterless" | "contained";
    header: JSX.Element;
    extraHeader: JSX.Element;
    contained: boolean;
    footer: boolean;
  }>
>;

const PageContainer = (props: PageContainerProps) => {
  const {
    pageContainerType = "default",
    children,
    header,
    contained = false,
    extraHeader,
    footer = true,
  } = props;

  return (
    <div className="h-full flex flex-auto flex-col justify-between">
      <main className="h-full">
        <div
          className={classNames(
            "page-container relative h-full flex flex-auto flex-col",
            pageContainerType !== "gutterless" &&
              `${PAGE_CONTAINER_GUTTER_X} ${PAGE_CONTAINER_GUTTER_Y}`,
            pageContainerType === "contained" && "container mx-auto",
          )}
        >
          {(header || extraHeader) && (
            <div
              className={classNames(
                contained && "container mx-auto",
                "flex items-center justify-between mb-4",
              )}
            >
              <div>
                {header && typeof header === "string" && <h3>{header}</h3>}
                <Suspense fallback={<div></div>}>
                  {header && typeof header !== "string" && (
                    <CustomHeader header={header} />
                  )}
                </Suspense>
              </div>
              <Suspense fallback={<div></div>}>
                {extraHeader && typeof extraHeader !== "string" && (
                  <CustomHeader header={extraHeader} />
                )}
              </Suspense>
            </div>
          )}
          {pageContainerType === "contained" ? (
            <Container className="h-full">
              <>{children}</>
            </Container>
          ) : (
            <>{children}</>
          )}
        </div>
      </main>
      {footer && <Footer pageContainerType={pageContainerType} />}
    </div>
  );
};

export default PageContainer;
